const CrazyConfig = require("../class/CrazyConfig")

let conf = `Crazy Storm Data 1.01
Center:315,240,0,0,0,0,
Totalframe:1000
Layer2:新图层 ,1,200,2,0,0,0,0
0,1,False,1,True,,320,224,1,200,316,240,0,0,{X:0 Y:0},6,5,90,{X:0 Y:0},720,0,0,{X:0 Y:0},0,0,{X:0 Y:0},200,119,1,1,255,255,255,100,0,{X:0 Y:0},True,3,0,{X:0 Y:0},0,0,{X:0 Y:0},1,1,True,True,True,False,True,False,,新事件组|22|22|当前帧=40且当前帧=50：生命变化到10，正比，1帧(0);当前帧=20且当前帧=30：生命变化到10，正比，1帧(0);&新事件组2|1|0|当前帧=1且当前帧=2：宽比增加90，固定，1帧(0);当前帧=3且当前帧=4：高比减少90，正弦，1帧(0);当前帧>10：生命变化到100，正比，1帧;&,0,0,0,0,0,0,0,0,0,0,0,0,0,999,0,0,0,True,True,True,False
1,1,False,-1,False,,320,160,1,200,-99998,-99998,0,0,{X:0 Y:0},1,5,0,{X:0 Y:0},360,0,0,{X:0 Y:0},0,0,{X:0 Y:0},200,1,1,1,255,255,255,100,0,{X:0 Y:0},True,5,0,{X:0 Y:0},0,0,{X:0 Y:0},1,1,True,True,False,False,True,False,,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,True,True,True,False
Layer3:empty
Layer4:empty
`


function main()
{
    let config = new CrazyConfig(conf)
    console.log(`config test complete!`)
}

main()
