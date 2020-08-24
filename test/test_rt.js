let conf = `Crazy Storm Data 1.01
Center:315,240,0,0,0,0,
Totalframe:200000
Layer1:新图层 ,1,200,1,0,0,0,0
0,0,False,-1,False,,320,224,1,200,-99998,-99998,50,0,{X:0 Y:0},1,5,0,{X:0 Y:0},0,0,0,{X:0 Y:0},0,0,{X:0 Y:0},200,1,1,1,255,255,255,100,0,{X:0 Y:0},True,5,0,{X:0 Y:0},0,0,{X:0 Y:0},1,1,True,True,False,False,True,False,,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,True,True,True,False
Layer2:empty
Layer3:empty
Layer4:empty
`

let CrazyStormRT = require("../class/CrazyStormRT")

let rt = new CrazyStormRT(conf)

function main()
{ 
    setInterval(()=>
    {
        rt.update()
    }, 1000/60)
}

main()
