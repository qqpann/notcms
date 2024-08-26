import Image from "next/image";
import { Header } from "~/components/Header";

export default function Home() {
  return <Landing />;
}

const FeatureCard = ({
  desc = "Capture a moment while Notion continues to be edited.",
  title = "Article snapshots",
  className,
}: {
  desc: string;
  title: string;
  className: any;
}): JSX.Element => {
  return (
    <div
      className={`flex flex-col items-start justify-end gap-4 p-5 relative bg-[#ffffff03] rounded-[12px_20px_20px_12px] overflow-hidden border-[0.5px] border-solid border-transparent shadow-[inset_0px_-80px_96px_#ffffff14] [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1] ${className}`}
    >
      <div className="absolute w-[100px] h-48 top-5 left-[241px]" />
      <div className="relative self-stretch [background:linear-gradient(180deg,rgb(245,75,159)_0%,rgb(249,86,137)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Inter',Helvetica] font-medium text-transparent text-base tracking-[0.16px] leading-4">
        {title}
      </div>
      <p className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-white text-base tracking-[0.16px] leading-[22px]">
        {desc}
      </p>
    </div>
  );
};

function Landing() {
  return (
    <div className="flex flex-col w-[1440px] items-start relative bg-white [background:linear-gradient(180deg,rgb(15,15,17)_0%,rgb(0,0,0)_100%)]">
      <img
        className="w-[1440px] h-[800px] left-0 absolute top-0"
        alt="Ellipse"
        src="https://c.animaapp.com/PNtvr1Xl/img/ellipse-1911.svg"
      />

      <Header />

      <div className="flex flex-col items-center gap-12 px-32 py-16 relative self-stretch w-full flex-[0_0_auto]">
        <p className="relative self-stretch mt-[-1.00px] [font-family:'Roobert_TRIAL-SemiBold',Helvetica] font-semibold text-white text-[64px] text-center tracking-[0.64px] leading-[72px]">
          Instantly create &amp; publish
          <br />
          your website content from Notion
        </p>
        <p className="relative self-stretch [font-family:'Selecta_VF_Trial-Medium',Helvetica] font-normal text-white text-lg text-center tracking-[0.36px] leading-[26px]">
          <span className="font-medium tracking-[0.06px]">
            Make website content management easier.
          </span>
          <span className="[font-family:'Selecta_VF_Trial-Regular',Helvetica] tracking-[0.06px]">
            &nbsp;
          </span>
          <span className="[font-family:'Selecta_VF_Trial-Light',Helvetica] font-light tracking-[0.06px]">
            Set up your website with NotCMS once <br />
            and update your content in Notion forever. See changes in seconds!
          </span>
        </p>
        <div className="flex flex-col w-[146px] h-14 items-center justify-center gap-4 p-5 relative rounded-[32px] border-[0.5px] border-solid border-transparent [border-image:linear-gradient(to_bottom,rgba(255,135,99,0),rgb(254,2,144.8))_1]">
          <div className="flex w-[138px] h-12 items-center justify-center gap-4 p-5 relative mt-[-16.00px] mb-[-16.00px] ml-[-16.00px] mr-[-16.00px] rounded-[32px] border-[0.5px] border-solid border-transparent [border-image:linear-gradient(to_bottom,rgb(255,135,99),rgba(254,2,144.8,0))_1]">
            <div className="inline-flex h-10 gap-2 px-5 py-2 flex-[0_0_auto] mt-[-16.00px] mb-[-16.00px] ml-[-16.00px] mr-[-16.00px] rounded-[44px] border border-solid shadow-[0px_2px_4px_-1px_#e56ba152,0px_4px_8px_-2px_#e66ba229,0px_8px_16px_-4px_#e66ba214] [border-image:linear-gradient(to_bottom,rgba(254,13,142,0),rgb(255,255,255))_1] [background:linear-gradient(180deg,rgb(255,135,99)_0%,rgb(254,2,144.8)_100%)] items-center justify-center relative overflow-hidden border-transparent">
              <div className="relative w-fit [font-family:'Inter',Helvetica] font-medium text-white text-base text-center tracking-[0.16px] leading-[19px] whitespace-nowrap">
                Get started
              </div>
            </div>
          </div>
        </div>
        <div className="relative self-stretch w-full h-[768px] bg-[#20202080] rounded-[20px] border-[0.5px] border-solid border-transparent backdrop-blur-[48px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(48px)_brightness(100%)] [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1]" />
      </div>
      <div className="flex flex-col items-center gap-16 px-32 py-16 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col items-start gap-8 relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative self-stretch mt-[-1.00px] [background:linear-gradient(180deg,rgb(245,75,159)_0%,rgb(249,86,137)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'DM_Mono',Helvetica] font-normal text-transparent text-base text-center tracking-[0.80px] leading-[72px]">
            WHY NOTCMS IS BETTER
          </div>
          <div className="relative self-stretch [font-family:'Roobert_TRIAL-SemiBold',Helvetica] font-semibold text-white text-5xl text-center tracking-[0.48px] leading-[72px]">
            Why NotCMS is better
          </div>
        </div>
        <div className="inline-flex flex-col items-start gap-5 relative flex-[0_0_auto]">
          <div className="flex w-[984px] items-start justify-center gap-5 relative flex-[0_0_auto]">
            <div className="flex flex-col h-[350px] items-start justify-end gap-4 p-5 relative flex-1 grow rounded-[20px_12px_12px_20px] overflow-hidden border-[0.5px] border-solid border-transparent [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0)_44.74%,rgba(255,255,255,0.12)_100%)]">
              <div className="relative flex-1 self-stretch w-full grow">
                <div className="relative w-[473px] h-[269px] top-6 left-6">
                  <img
                    className="absolute w-[271px] h-[269px] top-0 left-0"
                    alt="Image"
                    src="https://c.animaapp.com/PNtvr1Xl/img/image@2x.png"
                  />
                  <img
                    className="absolute w-3 h-3 top-9 left-8 object-cover"
                    alt="Image"
                    src="https://c.animaapp.com/PNtvr1Xl/img/image-2168@2x.png"
                  />
                  <div className="absolute w-10 h-2 top-3 left-3">
                    <div className="w-2 h-2 left-0 bg-[#ffffff1f] rounded absolute top-0" />
                    <div className="w-2 h-2 left-4 bg-[#ffffff1f] rounded absolute top-0" />
                    <div className="w-2 h-2 left-8 bg-[#ffffff1f] rounded absolute top-0" />
                  </div>
                  <div className="flex flex-col items-start gap-2 absolute w-[441px] h-[107px] top-[63px] left-8">
                    <p className="relative self-stretch [font-family:'SF_Pro_Display-Regular',Helvetica] font-normal text-transparent text-base tracking-[0.48px] leading-4">
                      <span className="text-white tracking-[0.08px] leading-6">
                        Small heading
                        <br />
                      </span>
                    </p>
                    <p className="relative self-stretch [font-family:'SF_Pro_Display-Regular',Helvetica] font-normal text-transparent text-base tracking-[0.48px] leading-4">
                      <span className="text-[#ffffffb8] text-sm tracking-[0.06px] leading-5">
                        The minimum viable product, as many founders know it,
                        doesn&#39;t reflect the reality of how products get
                        built today.
                        <br />
                      </span>
                    </p>
                    <p className="relative self-stretch [font-family:'SF_Pro_Display-Regular',Helvetica] font-normal text-transparent text-base tracking-[0.48px] leading-4">
                      <span className="text-[#ffffffb8] text-sm tracking-[0.06px] leading-5">
                        Building something valuable is no longer about
                        validating a novel idea Below I’ll discuss
                      </span>
                    </p>
                  </div>
                  <p className="absolute top-[37px] left-[50px] [font-family:'SF_Pro_Display-Regular',Helvetica] font-normal text-transparent text-xs tracking-[0.36px] leading-6 whitespace-nowrap">
                    <span className="text-[#ffffff7a] tracking-[0.04px]">
                      /&nbsp;&nbsp;
                    </span>
                    <span className="text-white tracking-[0.04px]">
                      Website&nbsp;&nbsp;
                    </span>
                    <span className="text-[#ffffff7a] tracking-[0.04px]">
                      /
                    </span>
                    <span className="text-white tracking-[0.04px]">
                      &nbsp;&nbsp;Blogs
                    </span>
                  </p>
                  <div className="absolute w-px h-4 top-[158px] left-[139px] bg-[#fe0291]" />
                  <div className="inline-flex items-center justify-center gap-2 pt-[3px] pb-1 px-[3px] absolute top-[177px] left-[139px] bg-[#fe0291] rounded-sm overflow-hidden">
                    <div className="relative w-fit mt-[-1.00px] [font-family:'SF_Pro_Display-Regular',Helvetica] font-normal text-white text-[10px] tracking-[0.30px] leading-5 whitespace-nowrap">
                      quishi
                    </div>
                  </div>
                  <div className="absolute w-[92px] h-4 top-[158px] left-[47px] [background:linear-gradient(180deg,rgba(254,2,145,0)_0%,rgba(254,2,145,0.2)_100%)]" />
                </div>
              </div>
              <p className="relative self-stretch [font-family:'Inter',Helvetica] font-medium text-white text-base tracking-[0.16px] leading-[22px]">
                Writing is effortless in Notion
              </p>
              <p className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-zinc-300 text-[13px] tracking-[0.13px] leading-[19px]">
                Most CMS’ have editors with high learning curves. NotCMS uses
                the user-friendly Notion editor to write.
              </p>
            </div>
            <div className="justify-end p-5 rounded-xl [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0)_44.74%,rgba(255,255,255,0.12)_100%)] flex flex-col h-[350px] items-start gap-4 relative flex-1 grow overflow-hidden border-[0.5px] border-solid border-transparent [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1]">
              <div className="relative flex-1 self-stretch w-full grow">
                <div className="w-[404px] h-[269px] left-[-65px] relative top-6 rounded-2xl [background:linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)]">
                  <div className="absolute top-[91px] left-[171px] [font-family:'Inter',Helvetica] font-normal text-white text-[10px] tracking-[0.10px] leading-[19px] whitespace-nowrap">
                    yoursite.com
                  </div>
                  <div className="absolute w-3 h-3 top-[67px] left-[196px] rounded border-2 border-solid border-[#ffffff1f] [background:linear-gradient(180deg,rgb(254,157,127)_0%,rgb(217,100,65)_100%)]" />
                </div>
              </div>
              <p className="relative w-fit [font-family:'Inter',Helvetica] font-medium text-white text-base tracking-[0.16px] leading-[22px] whitespace-nowrap">
                Integrate easier with your site
              </p>
              <p className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-zinc-300 text-[13px] tracking-[0.13px] leading-[19px]">
                Set up NotCMS with your site in under 30 minutes and start
                writing instantly.
              </p>
            </div>
            <div className="flex flex-col h-[350px] items-start justify-end gap-4 p-5 relative flex-1 grow bg-[#ffffff03] rounded-[12px_20px_20px_12px] overflow-hidden border-[0.5px] border-solid border-transparent shadow-[inset_0px_-80px_96px_#ffffff14] [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1]">
              <div className="relative flex-1 self-stretch w-full grow">
                <div className="w-[347px] h-[195px] left-[-72px] relative top-6 rounded-2xl [background:linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)]">
                  <div className="absolute w-48 h-[134px] top-[30px] left-[114px]">
                    <img
                      className="top-[133px] absolute w-48 h-px left-0"
                      alt="Line"
                      src="https://c.animaapp.com/PNtvr1Xl/img/line-255.svg"
                    />
                    <img
                      className="top-[70px] absolute w-48 h-px left-0"
                      alt="Line"
                      src="https://c.animaapp.com/PNtvr1Xl/img/line-260.svg"
                    />
                    <img
                      className="top-[7px] absolute w-48 h-px left-0"
                      alt="Line"
                      src="https://c.animaapp.com/PNtvr1Xl/img/line-260.svg"
                    />
                    <img
                      className="top-[39px] absolute w-48 h-px left-0"
                      alt="Line"
                      src="https://c.animaapp.com/PNtvr1Xl/img/line-260.svg"
                    />
                    <img
                      className="top-[102px] absolute w-48 h-px left-0"
                      alt="Line"
                      src="https://c.animaapp.com/PNtvr1Xl/img/line-260.svg"
                    />
                    <div className="inline-flex h-[133px] items-end gap-12 absolute top-0 left-9">
                      <div className="relative w-1.5 h-[63px] rounded-[3px] border-[0.5px] border-solid border-transparent [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(254,11,142,0))_1] [background:linear-gradient(180deg,rgb(255,135,99)_0%,rgb(254,2,144.8)_100%)]" />
                      <div className="inline-flex h-[133px] items-end gap-1.5 relative flex-[0_0_auto]">
                        <div className="relative w-1.5 h-[122px] bg-[#373739] rounded-[3px] border-[0.5px] border-solid border-transparent [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1]" />
                        <div className="relative w-1.5 h-[126px] bg-[#373739] rounded-[3px] border-[0.5px] border-solid border-transparent [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1]" />
                        <div className="relative w-1.5 h-[137px] mt-[-4.00px] bg-[#373739] rounded-[3px] border-[0.5px] border-solid border-transparent [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1]" />
                        <div className="relative w-1.5 h-[122px] bg-[#373739] rounded-[3px] border-[0.5px] border-solid border-transparent [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1]" />
                        <div className="relative w-1.5 h-[116px] bg-[#373739] rounded-[3px] border-[0.5px] border-solid border-transparent [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1]" />
                        <div className="relative w-1.5 h-[119px] bg-[#373739] rounded-[3px] border-[0.5px] border-solid border-transparent [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1]" />
                      </div>
                    </div>
                    <div className="inline-flex items-center justify-center gap-2 px-[5px] py-1 absolute top-12 left-[29px] rounded-[15.5px] border-[0.5px] border-solid border-transparent [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(254,11,142,0))_1] [background:linear-gradient(180deg,rgb(255,135,99)_0%,rgb(254,2,144.8)_100%)]">
                      <div className="w-fit mt-[-0.50px] font-normal text-[8px] text-center tracking-[0.08px] whitespace-nowrap relative [font-family:'Inter',Helvetica] text-white leading-[72px]">
                        $5
                      </div>
                    </div>
                  </div>
                  <div className="absolute w-[9px] top-24 left-[93px] [font-family:'Inter',Helvetica] text-[10px] text-right tracking-[0.10px] leading-[72px] opacity-50 font-normal text-white">
                    5
                  </div>
                  <div className="absolute w-[9px] top-[158px] left-[93px] [font-family:'Inter',Helvetica] text-[10px] text-right tracking-[0.10px] leading-[72px] opacity-50 font-normal text-white">
                    0
                  </div>
                  <div className="absolute w-3.5 top-8 left-[88px] [font-family:'Inter',Helvetica] text-[10px] text-right tracking-[0.10px] leading-[72px] opacity-50 font-normal text-white">
                    10
                  </div>
                  <div className="inline-flex items-center justify-center gap-2 px-[5px] py-1 absolute top-4 left-60 rounded-[15.5px] border-[0.5px] border-solid border-transparent [border-image:linear-gradient(to_bottom,rgba(255,255,255,0),rgb(255,255,255))_1] [background:linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)]">
                    <div className="relative w-fit mt-[-0.50px] [font-family:'Inter',Helvetica] font-normal text-white text-[8px] text-center tracking-[0.08px] leading-[72px] whitespace-nowrap">
                      ~$10
                    </div>
                  </div>
                  <div className="absolute top-[174px] left-[220px] [font-family:'Inter',Helvetica] font-normal text-white text-[10px] text-center tracking-[0.10px] leading-[19px] whitespace-nowrap">
                    Others
                  </div>
                  <div className="absolute top-[174px] left-[132px] [font-family:'Inter',Helvetica] font-normal text-white text-[10px] text-center tracking-[0.10px] leading-[19px] whitespace-nowrap">
                    NotCMS
                  </div>
                </div>
              </div>
              <p className="relative self-stretch [font-family:'Inter',Helvetica] font-medium text-white text-base tracking-[0.16px] leading-[22px]">
                2× as affordable, just as effective
              </p>
              <p className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-zinc-300 text-[13px] tracking-[0.13px] leading-[19px]">
                NotCMS comes with a TypeScript SDK. Your databases comes to your
                hands with a few typed properties.
              </p>
            </div>
          </div>
          <div className="flex w-[984px] items-start p-[0.5px] relative flex-[0_0_auto] rounded-[20px_20px_0px_0px] border-t-[0.5px] [border-top-style:solid] border-r-[0.5px] [border-right-style:solid] border-l-[0.5px] [border-left-style:solid] border-transparent [border-image:linear-gradient(to_bottom,rgba(255,255,255,0.12),rgba(15,15,17,0))_1] [background:linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(15,15,17,0)_100%)]">
            <div className="flex flex-col items-start gap-5 p-8 relative flex-1 self-stretch grow">
              <div className="relative w-fit mt-[-0.50px] [font-family:'Inter',Helvetica] font-medium text-white text-base tracking-[0.16px] leading-[19px] whitespace-nowrap">
                Save time
              </div>
              <p className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#ffffffcc] text-sm tracking-[0.14px] leading-5">
                Don’t waste engineering time manually writing code and building
                infrastructure to extract and maintain web data.
              </p>
            </div>
            <div className="relative self-stretch w-px [background:linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(15,15,17,0)_100%)]" />
            <div className="flex flex-col items-start gap-5 p-8 relative flex-1 self-stretch grow">
              <div className="relative w-fit mt-[-0.50px] [font-family:'Inter',Helvetica] font-medium text-white text-base tracking-[0.16px] leading-[19px] whitespace-nowrap">
                Save hassle
              </div>
              <p className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#ffffffcc] text-sm tracking-[0.14px] leading-5">
                Avoid worrying about proxies, headless browsers, data
                consistency, silent failures, etc. NotCMS deals in web data
                without the difficulty.
              </p>
            </div>
            <div className="relative self-stretch w-px [background:linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(15,15,17,0)_100%)]" />
            <div className="flex flex-col items-start gap-5 p-8 relative flex-1 self-stretch grow">
              <div className="relative w-fit mt-[-0.50px] [font-family:'Inter',Helvetica] font-medium text-white text-base tracking-[0.16px] leading-[19px] whitespace-nowrap">
                Save money
              </div>
              <p className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#ffffffcc] text-sm tracking-[0.14px] leading-5">
                Data scraping specialists and in-house engineering teams don’t
                come cheap. Keep your business costs down and get Reworkd up and
                running.
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-[782px] items-center gap-8 p-8 relative flex-[0_0_auto] rounded-[20px] overflow-hidden border-[0.5px] border-solid border-[#ffffff1f] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0)_44.74%,rgba(255,255,255,0.12)_100%)]">
          <div className="relative w-fit mt-[-0.50px] [font-family:'Inter',Helvetica] font-medium text-white text-xl tracking-[0.20px] leading-[26px]">
            10x cheaper <br />
            than Contentful
          </div>
          <p className="relative flex-1 [font-family:'Inter',Helvetica] font-normal text-white text-base tracking-[0.16px] leading-6">
            That means $820,000 saved a year when logging 200TB/month. Every
            year. Stop overpaying!
          </p>
        </div>
      </div>
      <div className="flex items-start justify-center gap-8 px-32 py-16 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col items-start gap-8 relative flex-1 grow">
          <div className="relative self-stretch mt-[-1.00px] [background:linear-gradient(180deg,rgb(245,75,159)_0%,rgb(249,86,137)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'DM_Mono',Helvetica] font-normal text-transparent text-base tracking-[0.80px] leading-[72px]">
            DESIGNED FOR SPEED
          </div>
          <p className="relative self-stretch [font-family:'Roobert_TRIAL-SemiBold',Helvetica] font-semibold text-white text-5xl tracking-[0.48px] leading-[56px]">
            A seamless experience <br />
            for every role
          </p>
        </div>
        <div className="flex h-10 items-center gap-0.5 p-1 relative flex-1 grow bg-[#22252a] rounded-3xl overflow-hidden">
          <div className="flex items-center justify-center gap-1.5 px-3 py-[5px] relative flex-1 self-stretch grow bg-[#2b2e33] rounded-[24px_8px_8px_24px] border-[0.5px] border-solid border-transparent shadow-[0px_0px_1px_#000000b2] [border-image:linear-gradient(to_bottom,rgb(75,80,90),rgb(33,35,39))_1]">
            <div className="relative w-fit [font-family:'Inter',Helvetica] font-normal text-textwhite text-sm text-center tracking-[0.28px] leading-[14px] whitespace-nowrap">
              Developers
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 px-3 py-[5px] relative flex-1 self-stretch grow rounded-lg shadow-shadow-m">
            <div className="relative w-fit [font-family:'Inter',Helvetica] font-normal text-[#919baa] text-sm text-center tracking-[0.28px] leading-[14px] whitespace-nowrap">
              Writers
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 px-3 py-[5px] relative flex-1 self-stretch grow rounded-lg shadow-shadow-m">
            <div className="relative w-fit [font-family:'Inter',Helvetica] font-normal text-[#919baa] text-sm text-center tracking-[0.28px] leading-[14px] whitespace-nowrap">
              Managers
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-16 px-32 py-16 relative self-stretch w-full flex-[0_0_auto]">
        <div className="inline-flex flex-col items-start justify-between relative self-stretch flex-[0_0_auto]">
          <div className="inline-flex flex-col items-start gap-6 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] [background:linear-gradient(180deg,rgb(245,75,159)_0%,rgb(249,86,137)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'DM_Mono',Helvetica] font-normal text-transparent text-base text-center tracking-[0.80px] leading-[72px] whitespace-nowrap">
              DEVELOPER FORWARD
            </div>
            <p className="relative w-fit [font-family:'Roobert_TRIAL-SemiBold',Helvetica] font-semibold text-white text-5xl tracking-[0.48px] leading-[56px]">
              Made with your
              <br />
              framework in mind.
            </p>
          </div>
          <p className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#ffffffcc] text-sm tracking-[0.14px] leading-5">
            NotCMS comes with a TypeScript SDK. Your databases comes to your
            hands with a few typed properties.
          </p>
        </div>
        <div className="pt-1.5 pb-4 px-1 bg-[#ffffff03] rounded-[20px] shadow-[inset_0px_-32px_80px_#ffffff14] flex flex-col h-[350px] items-start gap-4 relative flex-1 grow overflow-hidden border-[0.5px] border-solid border-transparent [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1]">
          <div className="flex items-center px-0.5 py-0 relative self-stretch w-full flex-[0_0_auto]">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-0 relative self-stretch flex-[0_0_auto] mt-[-0.50px] mb-[-0.50px] ml-[-0.50px] rounded-[14px_14px_0px_0px] border-t-[0.5px] [border-top-style:solid] border-r-[0.5px] [border-right-style:solid] border-l-[0.5px] [border-left-style:solid] border-transparent [border-image:linear-gradient(to_bottom,rgba(255,255,255,0.12),rgba(255,255,255,0))_1] [background:linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)]">
              <div className="relative w-fit [font-family:'Inter',Helvetica] font-normal text-white text-[13px] text-center tracking-[0.13px] leading-[22px] whitespace-nowrap">
                React
              </div>
            </div>
            <div className="inline-flex h-[30px] items-center justify-center gap-8 pt-2.5 pb-[11px] px-4 relative flex-[0_0_auto] rounded-[0px_0px_8px_0px] border-r-[0.5px] [border-right-style:solid] border-b-[0.5px] [border-bottom-style:solid] border-transparent rotate-180 [border-image:linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0.12)_36%,rgba(255,255,255,0)_100%)_1]">
              <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto] mb-[-1.00px] rotate-180">
                <div className="relative w-fit mt-[-0.50px] opacity-50 [font-family:'Inter',Helvetica] font-light text-white text-[13px] text-center tracking-[0.13px] leading-[22px] whitespace-nowrap">
                  Next.js
                </div>
              </div>
              <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto] mb-[-1.00px] rotate-180">
                <div className="relative w-fit mt-[-0.50px] opacity-50 [font-family:'Inter',Helvetica] font-light text-white text-[13px] text-center tracking-[0.13px] leading-[22px] whitespace-nowrap">
                  Next.js
                </div>
              </div>
              <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto] mb-[-1.00px] rotate-180">
                <div className="relative w-fit mt-[-0.50px] opacity-50 [font-family:'Inter',Helvetica] font-light text-white text-[13px] text-center tracking-[0.13px] leading-[22px] whitespace-nowrap">
                  Next.js
                </div>
              </div>
              <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto] mb-[-1.00px] rotate-180">
                <div className="relative w-fit mt-[-0.50px] opacity-50 [font-family:'Inter',Helvetica] font-light text-white text-[13px] text-center tracking-[0.13px] leading-[22px] whitespace-nowrap">
                  Next.js
                </div>
              </div>
              <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto] mb-[-1.00px] rotate-180">
                <div className="relative w-fit mt-[-0.50px] opacity-50 [font-family:'Inter',Helvetica] font-light text-white text-[13px] text-center tracking-[0.13px] leading-[22px] whitespace-nowrap">
                  Next.js
                </div>
              </div>
            </div>
            <div className="relative flex-[0_0_auto]" />
          </div>
          <div className="flex items-start gap-4 px-5 py-0 relative self-stretch w-full flex-[0_0_auto]">
            <div className="inline-flex flex-col items-start gap-3 relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] [font-family:'JetBrains_Mono',Helvetica] text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap opacity-50 font-normal text-white">
                1
              </div>
              <div className="relative w-fit [font-family:'JetBrains_Mono',Helvetica] text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap opacity-50 font-normal text-white">
                2
              </div>
              <div className="relative w-fit [font-family:'JetBrains_Mono',Helvetica] text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap opacity-50 font-normal text-white">
                3
              </div>
              <div className="relative w-fit [font-family:'JetBrains_Mono',Helvetica] text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap opacity-50 font-normal text-white">
                4
              </div>
              <div className="relative w-fit [font-family:'JetBrains_Mono',Helvetica] text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap opacity-50 font-normal text-white">
                5
              </div>
              <div className="relative w-fit [font-family:'JetBrains_Mono',Helvetica] text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap opacity-50 font-normal text-white">
                6
              </div>
              <div className="relative w-fit [font-family:'JetBrains_Mono',Helvetica] text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap opacity-50 font-normal text-white">
                7
              </div>
              <div className="relative w-fit [font-family:'JetBrains_Mono',Helvetica] text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap opacity-50 font-normal text-white">
                8
              </div>
              <div className="relative w-fit [font-family:'JetBrains_Mono',Helvetica] text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap opacity-50 font-normal text-white">
                9
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 relative flex-1 grow">
              <p className="relative w-fit mt-[-1.00px] [font-family:'JetBrains_Mono',Helvetica] font-normal text-transparent text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap">
                <span className="text-[#ffffffb2] tracking-[0.02px]">
                  import
                </span>
                <span className="text-white tracking-[0.02px]">&nbsp;</span>
                <span className="text-[#d748d4] tracking-[0.02px]">
                  {"{"}notcms{"}"}
                </span>
                <span className="text-white tracking-[0.02px]">&nbsp;</span>
                <span className="text-[#ffffffb2] tracking-[0.02px]">from</span>
                <span className="text-white tracking-[0.02px]">&nbsp;</span>
                <span className="text-[#4bdc35] tracking-[0.02px]">
                  ‘@notcms/database/’
                </span>
                <span className="text-white tracking-[0.02px]">;</span>
              </p>
              <p className="relative w-fit opacity-0 [font-family:'JetBrains_Mono',Helvetica] font-normal text-transparent text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap">
                <span className="text-[#ffffffb2] tracking-[0.02px]">
                  import
                </span>
                <span className="text-white tracking-[0.02px]">&nbsp;</span>
                <span className="text-[#d748d4] tracking-[0.02px]">
                  {"{"}notcms{"}"}
                </span>
                <span className="text-white tracking-[0.02px]">&nbsp;</span>
                <span className="text-[#ffffffb2] tracking-[0.02px]">from</span>
                <span className="text-white tracking-[0.02px]">&nbsp;</span>
                <span className="text-[#4bdc35] tracking-[0.02px]">
                  ‘@notcms/database/’
                </span>
                <span className="text-white tracking-[0.02px]">;</span>
              </p>
              <p className="relative w-fit [font-family:'JetBrains_Mono',Helvetica] font-normal text-transparent text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap">
                <span className="text-[#ffffffb2] tracking-[0.02px]">
                  export async function{" "}
                </span>
                <span className="text-[#33effc] tracking-[0.02px]">GET</span>
                <span className="text-[#ffffffb2] tracking-[0.02px]">
                  () {"{"}
                </span>
              </p>
              <p className="relative w-fit [font-family:'JetBrains_Mono',Helvetica] font-normal text-transparent text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap">
                <span className="text-[#ffffffb2] tracking-[0.02px]">
                  &nbsp;&nbsp;&nbsp;&nbsp;const{" "}
                </span>
                <span className="text-[#7a32ff] tracking-[0.02px]">sql</span>
                <span className="text-[#ffffffb2] tracking-[0.02px]"> = </span>
                <span className="text-[#33effc] tracking-[0.02px]">neon</span>
                <span className="text-[#ffffffb2] tracking-[0.02px]">(</span>
                <span className="text-[#7a32ff] tracking-[0.02px]">
                  process.env.DATABASE_URL
                </span>
                <span className="text-[#ffffffb2] tracking-[0.02px]">);</span>
              </p>
              <p className="relative w-fit opacity-0 [font-family:'JetBrains_Mono',Helvetica] font-normal text-transparent text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap">
                <span className="text-[#ffffffb2] tracking-[0.02px]">
                  &nbsp;&nbsp;&nbsp;&nbsp;const{" "}
                </span>
                <span className="text-[#7a32ff] tracking-[0.02px]">sql</span>
                <span className="text-[#ffffffb2] tracking-[0.02px]"> = </span>
                <span className="text-[#33effc] tracking-[0.02px]">neon</span>
                <span className="text-[#ffffffb2] tracking-[0.02px]">(</span>
                <span className="text-[#7a32ff] tracking-[0.02px]">
                  process.env.DATABASE_URL
                </span>
                <span className="text-[#ffffffb2] tracking-[0.02px]">);</span>
              </p>
              <p className="relative w-fit [font-family:'JetBrains_Mono',Helvetica] font-normal text-transparent text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap">
                <span className="text-[#ffffffb2] tracking-[0.02px]">
                  &nbsp;&nbsp;&nbsp;&nbsp;const{" "}
                </span>
                <span className="text-[#7a32ff] tracking-[0.02px]">rows</span>
                <span className="text-[#ffffffb2] tracking-[0.02px]">
                  {" "}
                  = await sql(
                </span>
                <span className="text-[#4ddd37] tracking-[0.02px]">
                  process.env.DATABASE_URL
                </span>
                <span className="text-[#ffffffb2] tracking-[0.02px]">);</span>
              </p>
              <p className="relative w-fit opacity-0 [font-family:'JetBrains_Mono',Helvetica] font-normal text-transparent text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap">
                <span className="text-[#ffffffb2] tracking-[0.02px]">
                  &nbsp;&nbsp;&nbsp;&nbsp;const{" "}
                </span>
                <span className="text-[#7a32ff] tracking-[0.02px]">rows</span>
                <span className="text-[#ffffffb2] tracking-[0.02px]">
                  {" "}
                  = await sql(
                </span>
                <span className="text-[#4ddd37] tracking-[0.02px]">
                  process.env.DATABASE_URL
                </span>
                <span className="text-[#ffffffb2] tracking-[0.02px]">);</span>
              </p>
              <p className="relative w-fit [font-family:'JetBrains_Mono',Helvetica] font-normal text-transparent text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap">
                <span className="text-[#ffffffb2] tracking-[0.02px]">
                  &nbsp;&nbsp;&nbsp;&nbsp;return{" "}
                </span>
                <span className="text-[#7a32ff] tracking-[0.02px]">
                  Response
                </span>
                <span className="text-[#33effc] tracking-[0.02px]">.json</span>
                <span className="text-[#ffffffb2] tracking-[0.02px]">
                  ({"{"} rows {"}"})
                </span>
              </p>
              <div className="relative w-fit [font-family:'JetBrains_Mono',Helvetica] font-normal text-[#ffffffb2] text-[13px] tracking-[0.13px] leading-[22px] whitespace-nowrap">
                {"}"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-16 px-32 py-16 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col items-start gap-8 relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative self-stretch mt-[-1.00px] [background:linear-gradient(180deg,rgb(245,75,159)_0%,rgb(249,86,137)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'DM_Mono',Helvetica] font-normal text-transparent text-base text-center tracking-[0.80px] leading-[72px]">
            DESIGNED FOR SPEED
          </div>
          <div className="relative self-stretch [font-family:'Roobert_TRIAL-SemiBold',Helvetica] font-semibold text-white text-5xl text-center tracking-[0.48px] leading-[72px]">
            Killer features for everyone
          </div>
        </div>
        <div className="flex gap-5 self-stretch w-full flex-col items-start relative flex-[0_0_auto]">
          <div className="flex h-[284px] items-start gap-5 relative self-stretch w-full">
            <FeatureCard
              className="!self-stretch !flex-1 !grow"
              desc="Capture a moment while Notion continues to be edited."
              title="Article snapshots"
            />
            <img
              className="relative flex-1 self-stretch grow"
              alt="Frame"
              src="https://c.animaapp.com/PNtvr1Xl/img/frame-2147223773.svg"
            />
          </div>
          <div className="flex h-[284px] items-start gap-5 relative self-stretch w-full">
            <img
              className="relative flex-1 self-stretch grow"
              alt="Frame"
              src="https://c.animaapp.com/PNtvr1Xl/img/frame-1000001144.svg"
            />
            <img
              className="relative flex-1 self-stretch grow"
              alt="Frame"
              src="https://c.animaapp.com/PNtvr1Xl/img/frame-2147223773-1.svg"
            />
          </div>
        </div>
        <div className="inline-flex gap-5 p-5 bg-[#ffffff0d] flex-col items-start relative flex-[0_0_auto]">
          <div className="relative w-[805px] mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-white text-base text-center tracking-[0.16px] leading-4">
            Frontend blog templates
          </div>
          <p className="relative w-[805px] [font-family:'Inter',Helvetica] font-normal text-white text-sm text-center tracking-[0.14px] leading-5">
            Ordinal headless CMS is usually just a set of untyped API. You have
            to ensure its properties by yourself after all.
          </p>
        </div>
        <div className="inline-flex gap-5 p-5 bg-[#ffffff0d] flex-col items-start relative flex-[0_0_auto]">
          <p className="relative w-[805px] mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-white text-base text-center tracking-[0.16px] leading-4">
            Support other framework (other than Next.js) tutorials
          </p>
          <p className="relative w-[805px] [font-family:'Inter',Helvetica] font-normal text-white text-sm text-center tracking-[0.14px] leading-5">
            Ordinal headless CMS is usually just a set of untyped API. You have
            to ensure its properties by yourself after all.
          </p>
        </div>
        <div className="inline-flex gap-5 p-5 bg-[#ffffff0d] flex-col items-start relative flex-[0_0_auto]">
          <div className="relative w-[805px] mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-white text-base text-center tracking-[0.16px] leading-4">
            SDK for other languages
          </div>
          <p className="relative w-[805px] [font-family:'Inter',Helvetica] font-normal text-white text-sm text-center tracking-[0.14px] leading-5">
            Ordinal headless CMS is usually just a set of untyped API. You have
            to ensure its properties by yourself after all.
          </p>
        </div>
        <div className="inline-flex gap-5 p-5 bg-[#ffffff0d] flex-col items-start relative flex-[0_0_auto]">
          <div className="relative w-[805px] mt-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-white text-base text-center tracking-[0.16px] leading-4">
            Developer forward
          </div>
          <p className="relative w-[805px] [font-family:'Inter',Helvetica] font-normal text-white text-sm text-center tracking-[0.14px] leading-5">
            Ordinal headless CMS is usually just a set of untyped API. You have
            to ensure its properties by yourself after all.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-16 px-32 py-16 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col items-start gap-8 relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative self-stretch mt-[-1.00px] [background:linear-gradient(180deg,rgb(245,75,159)_0%,rgb(249,86,137)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'DM_Mono',Helvetica] font-normal text-transparent text-base text-center tracking-[0.80px] leading-[72px]">
            DESIGNED FOR SPEED
          </div>
          <p className="relative self-stretch [font-family:'Roobert_TRIAL-SemiBold',Helvetica] font-semibold text-white text-5xl text-center tracking-[0.48px] leading-[72px]">
            Choose the right plan for yourself
          </p>
        </div>
        <div className="w-[984px] items-center justify-center gap-5 flex-[0_0_auto] flex relative">
          <div className="flex flex-col items-start justify-end gap-4 p-2 relative flex-1 grow bg-[#ffffff03] rounded-3xl border-[0.5px] border-solid border-transparent shadow-[inset_0px_-80px_96px_#ffffff14] [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1]">
            <div className="flex flex-col items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-start gap-4 p-4 relative self-stretch w-full flex-[0_0_auto] rounded-[16px_16px_8px_8px]">
                <div className="relative self-stretch mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-white text-xl tracking-[0.20px] leading-5">
                  Personal
                </div>
                <div className="self-stretch font-medium text-[32px] tracking-[0.32px] relative [font-family:'Inter',Helvetica] text-white leading-[72px]">
                  $0
                </div>
              </div>
              <div className="flex gap-2 px-4 py-0 self-stretch w-full flex-col items-start relative flex-[0_0_auto]">
                <div className="flex h-9 gap-4 p-4 self-stretch w-full bg-[#ffffff03] rounded-3xl border-[0.5px] border-solid shadow-[inset_0px_-80px_96px_#ffffff14] [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1] items-center justify-center relative overflow-hidden border-transparent">
                  <div className="mt-[-4.50px] mb-[-3.50px] [font-family:'Inter',Helvetica] text-base tracking-[0.16px] leading-[19px] relative w-fit font-medium text-white text-center whitespace-nowrap">
                    Get started
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col h-64 items-start gap-4 p-4 relative self-stretch w-full bg-[#ffffff03] rounded-[10px_10px_16px_16px] border-[0.5px] border-solid border-transparent shadow-[inset_0px_80px_96px_#ffffff14] [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1]">
              <div className="flex gap-5 self-stretch w-full flex-col items-start relative flex-[0_0_auto]">
                <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="relative self-stretch mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#8a8f98] text-base tracking-[0.16px] leading-4">
                    Feature name here
                  </div>
                  <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#8a8f98] text-base tracking-[0.16px] leading-4">
                    Feature name here
                  </div>
                  <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#8a8f98] text-base tracking-[0.16px] leading-4">
                    Feature name here
                  </div>
                  <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#8a8f98] text-base tracking-[0.16px] leading-4">
                    Feature name here
                  </div>
                  <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#8a8f98] text-base tracking-[0.16px] leading-4">
                    Feature name here
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start justify-end gap-4 p-2 relative flex-1 grow bg-[#ffffff03] rounded-3xl border-[0.5px] border-solid border-transparent shadow-[inset_0px_80px_96px_#ffffff14] [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1]">
            <div className="flex flex-col items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-start gap-4 p-4 relative self-stretch w-full flex-[0_0_auto] rounded-[16px_16px_8px_8px]">
                <div className="relative self-stretch mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-white text-xl tracking-[0.20px] leading-5">
                  Pro
                </div>
                <p className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-white text-[32px] tracking-[0.32px] leading-[72px]">
                  <span className="font-medium tracking-[0.10px]">$5</span>
                  <span className="text-xl tracking-[0.04px]">/user</span>
                </p>
              </div>
              <div className="flex gap-2 px-4 py-0 self-stretch w-full flex-col items-start relative flex-[0_0_auto]">
                <div className="flex h-9 gap-2 px-5 py-2 self-stretch w-full rounded-[44px] border-[0.5px] border-solid shadow-[0px_2px_4px_-1px_#fe029152,0px_4px_8px_-2px_#fe029129,0px_8px_16px_-4px_#fe029114] [border-image:linear-gradient(to_bottom,rgba(254,13,142,0),rgb(255,255,255))_1] [background:linear-gradient(180deg,rgb(255,135,99)_0%,rgb(254,2,144.8)_100%)] items-center justify-center relative overflow-hidden border-transparent">
                  <div className="relative w-fit [font-family:'Inter',Helvetica] font-medium text-white text-base text-center tracking-[0.16px] leading-[19px] whitespace-nowrap">
                    Get started
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-col h-64 items-start gap-4 pt-5 pb-4 px-4 self-stretch w-full bg-[#ffffff03] rounded-[10px_10px_16px_16px] border-[0.5px] border-solid border-transparent shadow-[inset_0px_-80px_96px_#ffffff14] [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1] flex relative">
              <div className="flex gap-5 self-stretch w-full flex-col items-start relative flex-[0_0_auto]">
                <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="relative self-stretch mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#8a8f98] text-base tracking-[0.16px] leading-4">
                    Feature name here
                  </div>
                  <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#8a8f98] text-base tracking-[0.16px] leading-4">
                    Feature name here
                  </div>
                  <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#8a8f98] text-base tracking-[0.16px] leading-4">
                    Feature name here
                  </div>
                  <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#8a8f98] text-base tracking-[0.16px] leading-4">
                    Feature name here
                  </div>
                  <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#8a8f98] text-base tracking-[0.16px] leading-4">
                    Feature name here
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start justify-end gap-4 p-2 relative flex-1 grow bg-[#ffffff03] rounded-3xl border-[0.5px] border-solid border-transparent shadow-[inset_0px_80px_96px_#ffffff14] [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1]">
            <div className="flex flex-col items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-start gap-4 p-4 relative self-stretch w-full flex-[0_0_auto] rounded-[16px_16px_8px_8px]">
                <div className="relative self-stretch mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-white text-xl tracking-[0.20px] leading-5">
                  Business
                </div>
                <p className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-white text-[32px] tracking-[0.32px] leading-[72px]">
                  <span className="font-medium tracking-[0.10px]">$9</span>
                  <span className="text-xl tracking-[0.04px]">/user</span>
                </p>
              </div>
              <div className="flex gap-2 px-4 py-0 self-stretch w-full flex-col items-start relative flex-[0_0_auto]">
                <div className="flex h-9 gap-2 px-5 py-2 self-stretch w-full rounded-[44px] border-[0.5px] border-solid shadow-[0px_2px_4px_-1px_#fe029152,0px_4px_8px_-2px_#fe029129,0px_8px_16px_-4px_#fe029114] [border-image:linear-gradient(to_bottom,rgba(254,13,142,0),rgb(255,255,255))_1] [background:linear-gradient(180deg,rgb(255,135,99)_0%,rgb(254,2,144.8)_100%)] items-center justify-center relative overflow-hidden border-transparent">
                  <div className="relative w-fit [font-family:'Inter',Helvetica] font-medium text-white text-base text-center tracking-[0.16px] leading-[19px] whitespace-nowrap">
                    Get started
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col h-64 items-start gap-4 p-4 relative self-stretch w-full bg-[#ffffff03] rounded-[10px_10px_16px_16px] border-[0.5px] border-solid border-transparent shadow-[inset_0px_80px_96px_#ffffff14] [border-image:linear-gradient(to_bottom,rgb(255,255,255),rgba(255,255,255,0))_1]">
              <div className="flex gap-5 self-stretch w-full flex-col items-start relative flex-[0_0_auto]">
                <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="relative self-stretch mt-[-1.00px] [font-family:'Inter',Helvetica] font-normal text-[#8a8f98] text-base tracking-[0.16px] leading-4">
                    Feature name here
                  </div>
                  <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#8a8f98] text-base tracking-[0.16px] leading-4">
                    Feature name here
                  </div>
                  <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#8a8f98] text-base tracking-[0.16px] leading-4">
                    Feature name here
                  </div>
                  <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#8a8f98] text-base tracking-[0.16px] leading-4">
                    Feature name here
                  </div>
                  <div className="relative self-stretch [font-family:'Inter',Helvetica] font-normal text-[#8a8f98] text-base tracking-[0.16px] leading-4">
                    Feature name here
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-start justify-center gap-12 px-32 py-16 relative self-stretch w-full flex-[0_0_auto]">
        <img
          className="relative w-[263.75px] mt-[-1.75px] ml-[-5.75px]"
          alt="Title"
          src="https://c.animaapp.com/PNtvr1Xl/img/title.svg"
        />
        <TextLinkList
          hasTitle
          className="!flex !w-[262px]"
          density="default"
          textLinkListItemDivClassName="!text-white"
          textLinkListItemDivClassName1="!text-white"
          textLinkListItemDivClassName2="!text-white"
          textLinkListItemDivClassName3="!text-white"
          textLinkListItemDivClassName4="!text-white"
          textLinkListItemDivClassName5="!text-white"
          textLinkListItemDivClassNameOverride="!text-white"
          textLinkListItemText="UI design"
          textLinkListItemText1="UX design"
          textLinkListItemText2="Wireframing"
          textLinkListItemText3="Diagramming"
          textLinkListItemText4="Brainstorming"
          textLinkListItemText5="Online whiteboard"
          textLinkListItemText6="Team collaboration"
          textStrongDivClassName="!text-white"
          textStrongText="Use cases"
        />
        <TextLinkList
          hasTitle
          className="!flex !w-[262px]"
          density="default"
          textLinkListItemDivClassName="!text-white"
          textLinkListItemDivClassName1="!text-white"
          textLinkListItemDivClassName2="!text-white"
          textLinkListItemDivClassName3="!text-white"
          textLinkListItemDivClassName4="!text-white"
          textLinkListItemDivClassName5="!text-white"
          textLinkListItemDivClassNameOverride="!text-white"
          textLinkListItemText="Design"
          textLinkListItemText1="Prototyping"
          textLinkListItemText2="Development features"
          textLinkListItemText3="Design systems"
          textLinkListItemText4="Collaboration features"
          textLinkListItemText5="Design process"
          textLinkListItemText6="FigJam"
          textStrongDivClassName="!text-white"
          textStrongText="Explore"
        />
        <TextLinkList
          hasTitle
          className="!mr-[-4.00px] !flex !w-[262px]"
          density="default"
          textLinkListItemDivClassName="!text-white"
          textLinkListItemDivClassName1="!text-white"
          textLinkListItemDivClassName2="!text-white"
          textLinkListItemDivClassName3="!text-white"
          textLinkListItemDivClassName4="!text-white"
          textLinkListItemDivClassName5="!text-white"
          textLinkListItemDivClassNameOverride="!text-white"
          textLinkListItemText="Blog"
          textLinkListItemText1="Best practices"
          textLinkListItemText2="Colors"
          textLinkListItemText3="Color wheel"
          textLinkListItemText4="Support"
          textLinkListItemText5="Developers"
          textLinkListItemText6="Resource library"
          textStrongDivClassName="!text-white"
          textStrongText="Resources"
        />
      </div>
    </div>
  );
}

const TextLinkList = ({
  hasTitle = true,
  density,
  className,
  textStrongDivClassName,
  textStrongText = "Text Strong",
  textLinkListItemDivClassName,
  textLinkListItemText = "List item",
  textLinkListItemDivClassNameOverride,
  textLinkListItemText1 = "List item",
  textLinkListItemDivClassName1,
  textLinkListItemText2 = "List item",
  textLinkListItemDivClassName2,
  textLinkListItemText3 = "List item",
  textLinkListItemDivClassName3,
  textLinkListItemText4 = "List item",
  textLinkListItemDivClassName4,
  textLinkListItemText5 = "List item",
  textLinkListItemDivClassName5,
  textLinkListItemText6 = "List item",
}: {
  hasTitle: boolean;
  density: "tight" | "default";
  className: any;
  textStrongDivClassName: any;
  textStrongText: string;
  textLinkListItemDivClassName: any;
  textLinkListItemText: string;
  textLinkListItemDivClassNameOverride: any;
  textLinkListItemText1: string;
  textLinkListItemDivClassName1: any;
  textLinkListItemText2: string;
  textLinkListItemDivClassName2: any;
  textLinkListItemText3: string;
  textLinkListItemDivClassName3: any;
  textLinkListItemText4: string;
  textLinkListItemDivClassName4: any;
  textLinkListItemText5: string;
  textLinkListItemDivClassName5: any;
  textLinkListItemText6: string;
}): JSX.Element => {
  return (
    <div
      className={`inline-flex flex-col items-start relative ${density === "tight" ? "gap-2" : "gap-3"} ${className}`}
    >
      {hasTitle && (
        <div
          className={`w-full flex self-stretch flex-col items-start gap-2.5 flex-[0_0_auto] relative ${
            density === "tight" ? "pt-0 pb-1 px-0" : "pt-0 pb-4 px-0"
          }`}
        >
          <TextStrong
            className="!self-stretch !flex-[0_0_auto] !flex !w-full"
            divClassName={textStrongDivClassName}
            text={textStrongText}
          />
        </div>
      )}

      <TextLinkListItem
        divClassName={textLinkListItemDivClassName}
        text={textLinkListItemText}
      />
      <TextLinkListItem
        divClassName={textLinkListItemDivClassNameOverride}
        text={textLinkListItemText1}
      />
      <TextLinkListItem
        divClassName={textLinkListItemDivClassName1}
        text={textLinkListItemText2}
      />
      <TextLinkListItem
        divClassName={textLinkListItemDivClassName2}
        text={textLinkListItemText3}
      />
      <TextLinkListItem
        divClassName={textLinkListItemDivClassName3}
        text={textLinkListItemText4}
      />
      <TextLinkListItem
        divClassName={textLinkListItemDivClassName4}
        text={textLinkListItemText5}
      />
      <TextLinkListItem
        divClassName={textLinkListItemDivClassName5}
        text={textLinkListItemText6}
      />
    </div>
  );
};

const TextLinkListItem = ({
  text = "List item",
  divClassName,
}: {
  text: string;
  divClassName: any;
}): JSX.Element => {
  return (
    <div className="relative w-[89px] h-[22px]">
      <div
        className={`absolute h-[22px] -top-px left-0 font-body-base font-[number:var(--body-base-font-weight)] text-[#1e1e1e] text-[length:var(--body-base-font-size)] tracking-[var(--body-base-letter-spacing)] leading-[var(--body-base-line-height)] whitespace-nowrap [font-style:var(--body-base-font-style)] ${divClassName}`}
      >
        {text}
      </div>
    </div>
  );
};
const TextStrong = ({
  text = "Text Strong",
  className,
  divClassName,
}: {
  text: string;
  className: any;
  divClassName: any;
}): JSX.Element => {
  return (
    <div className={`inline-flex items-start relative ${className}`}>
      <div
        className={`relative w-fit mt-[-1.00px] font-body-strong font-[number:var(--body-strong-font-weight)] text-[#1e1e1e] text-[length:var(--body-strong-font-size)] tracking-[var(--body-strong-letter-spacing)] leading-[var(--body-strong-line-height)] whitespace-nowrap [font-style:var(--body-strong-font-style)] ${divClassName}`}
      >
        {text}
      </div>
    </div>
  );
};
