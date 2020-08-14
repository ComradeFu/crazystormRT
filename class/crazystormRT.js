/**
 * crazy storm 1.03 （配置 1.01）的RunTime 类
 * 
 * 会对外暴露两个主要对象：
 * 1、自身信息（boss），主要是位置信息pos，可以被外界修改；
 * 2、自机信息（玩家），主要也是位置信息pos，可以被外界修改；
 * 
 * 会对外提供一个类：
 * 1、子弹View层基类（用来沟通view层跟里面逻辑层的关系）
 */
export default class CrazyStormRT 
{
    constructor(config)
    {
        if (config)
            this.load(config)

    }

    //从配置文件load入。配置文件见开发参考文档 开发者文档.txt
    load(config)
    {
        //
        
    }

    //进行跳动
    update()
    {

    }
}
