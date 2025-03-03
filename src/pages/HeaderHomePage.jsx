import {react} from "react"

const HeaderHomePage = () => {
    return (
        <>
            <div className="fixed bg-transparent w-full h-[16%]" style={{ mixBlendMode: "difference" }}>
                <div className="relative flex items-center justify-between h-[100%] w-[100%] bg-transparent">
                
                    <div className="bg-transparent pl-[3rem]">
                    <img src="/src/assets/WorkWaveLogo.svg" alt="" className="bg-transparent w-auto h-12" />
                    </div>

                    <div className="bg-transparent pr-[3rem]">
                    <img src="/src/assets/AccountLogo2.svg" alt="" className="bg-transparent w-auto h-16" />
                    </div>

                    <div className="absolute w-[95%] h-[2.5px] bottom-[0%] left-[2.5%] rounded-md bg-[#cec0ad]"></div>
                    <div className="absolute top-[calc(100%-33px)] left-1/2 translate-x-[-50%] h-[0px] w-[150px] bg-transparent">
                        <img src="/src/assets/HeaderWave.svg" alt="" className="bg-transparent w-auto h-auto" />
                    </div>

                </div>
            </div>
        </>
    )
}
export default HeaderHomePage

