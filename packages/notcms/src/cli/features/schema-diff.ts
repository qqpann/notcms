import type { Schema } from "../../types.js";
import { isSchema } from "./schema.js";

export type SchemaSummary =
  | { status: "compared"; changes: string[] }
  | { status: "missing" }
  | { status: "unavailable" };

export function summarizeSchema(
  existing: string | null,
  schema: Schema
): SchemaSummary {
  if (existing === null) return { status: "missing" };
  const previous = readSchemaLiteral(existing);
  if (previous === null) return { status: "unavailable" };

  const changes: string[] = [];
  const names = new Set([...Object.keys(previous), ...Object.keys(schema)]);
  for (const name of [...names].sort()) {
    const label = JSON.stringify(name);
    if (!Object.prototype.hasOwnProperty.call(previous, name)) {
      changes.push(`Added database: ${label}`);
      continue;
    }
    if (!Object.prototype.hasOwnProperty.call(schema, name)) {
      changes.push(`Removed database: ${label}`);
      continue;
    }
    const before = previous[name];
    const after = schema[name];
    if (before.id !== after.id) {
      changes.push(
        `Changed database ID: ${label}\n  ${JSON.stringify(before.id)} -> ${JSON.stringify(after.id)}`
      );
    }
    const properties = new Set([
      ...Object.keys(before.properties),
      ...Object.keys(after.properties),
    ]);
    for (const property of [...properties].sort()) {
      const propertyLabel = `${label}.${JSON.stringify(property)}`;
      if (!Object.prototype.hasOwnProperty.call(before.properties, property)) {
        changes.push(
          `Added property: ${propertyLabel} (${after.properties[property]})`
        );
      } else if (
        !Object.prototype.hasOwnProperty.call(after.properties, property)
      ) {
        changes.push(
          `Removed property: ${propertyLabel} (${before.properties[property]})`
        );
      } else if (before.properties[property] !== after.properties[property]) {
        changes.push(
          `Changed property type: ${propertyLabel}\n  ${before.properties[property]} -> ${after.properties[property]}`
        );
      }
    }
  }
  return { status: "compared", changes };
}

/**
 * Read only the data literal emitted by pull, including formatter changes
 * (bare keys, trailing commas and comments). Never import or evaluate a local
 * module: it constructs a Client and may contain arbitrary project code.
 * Expressions and other unsupported edits produce an unavailable summary.
 */
function readSchemaLiteral(source: string): Schema | null {
  const declaration = /\bexport\s+const\s+schema\s*=\s*/.exec(source);
  if (!declaration) return null;
  let position = declaration.index + declaration[0].length;

  function token(): string {
    const trivia = /(?:\s+|\/\/[^\r\n]*|\/\*[\s\S]*?\*\/)*/y;
    trivia.lastIndex = position;
    position += trivia.exec(source)?.[0].length ?? 0;
    const pattern =
      /"(?:[^"\\\r\n]|\\.)*"|[$_\p{ID_Start}][$\u200C\u200D\p{ID_Continue}]*|[{}\[\]:,]/uy;
    pattern.lastIndex = position;
    const match = pattern.exec(source);
    if (!match) throw new Error("Unsupported schema literal");
    position += match[0].length;
    return match[0];
  }

  function expect(expected: string): void {
    if (token() !== expected) throw new Error("Unsupported schema literal");
  }

  function object(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    let key = token();
    while (key !== "}") {
      if (key === "[") {
        key = token();
        if (!key.startsWith('"')) throw new Error("Unsupported computed key");
        expect("]");
      }
      const name: string = key.startsWith('"') ? JSON.parse(key) : key;
      if (
        !key.startsWith('"') &&
        !/^[$_\p{ID_Start}][$\u200C\u200D\p{ID_Continue}]*$/u.test(key)
      ) {
        throw new Error("Unsupported property key");
      }
      expect(":");
      const valueToken = token();
      const value: unknown =
        valueToken === "{"
          ? object()
          : valueToken.startsWith('"')
            ? JSON.parse(valueToken)
            : undefined;
      if (
        value === undefined ||
        Object.prototype.hasOwnProperty.call(result, name)
      ) {
        throw new Error("Unsupported or duplicate property");
      }
      Object.defineProperty(result, name, { enumerable: true, value });
      const separator = token();
      if (separator === "}") return result;
      if (separator !== ",") throw new Error("Unsupported schema literal");
      key = token();
    }
    return result;
  }

  try {
    expect("{");
    const value = object();
    // Do not mistake an object used in an expression for the full schema.
    if (
      !/^\s*(?:as\s+const\s*)?(?:satisfies\s+Schema\s*)?;/.test(
        source.slice(position)
      )
    ) {
      return null;
    }
    return isSchema(value) ? value : null;
  } catch {
    return null;
  }
}
