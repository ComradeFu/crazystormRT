/**
 * 负责读入 crazystorm 的配置项类
 */
module.exports = class CrazyConfig 
{
    constructor(config)
    {
        //配置文件信息
        this.desc = ""

        //中心点信息
        this.center = {}
        this.layers = {} //配置有关的layers信息
        
        //总帧数
        this.total_frame = 0

        this.load(config)
    }

    //从配置文件读入
    load(config)
    {
        let lines = config.split("\n")
        lines.splice(-1) // 尾部空行

        this.load_desc(lines)

        while(lines.length > 0)
        {
            let line = lines.splice(0, 1)[0]
            let pair = line.split(":")

            let key = pair[0]
            let val = pair[1]

            switch(key)
            {
                case "Center":
                    this.load_center(lines, val)
                    break;
                case "Totalframe":
                    this.load_total_frame(lines, val)
                    break;
                //Layer比较特殊，可能是作者没有仔细考虑过组织问题
                case "Layer1":
                    this.load_layers(lines, 1, val)
                    break;
                case "Layer2":
                    this.load_layers(lines, 2, val)
                    break;
                case "Layer3":
                    this.load_layers(lines, 3, val)
                    break;
                case "Layer4":
                    this.load_layers(lines, 4, val)
                    break;
                default:
                    console.error(`无法识别的配置:${key}`)
                    break;
            }
        }
    }

    //加载描述
    load_desc(lines)
    {
        let line = lines.splice(0, 1)[0]
        this.desc = line
    }

    //加载center信息
    load_center(lines, line)
    {
        let center = this.center

        let items = line.split(",")
        center.pos = [items[0], items[1]]
        center.speed = items[2]
        center.speed_angle = items[3]
        center.speed_acc = items[4]
        center.speed_acc_angle = items[5]
    }

    //加载全部帧信息
    load_total_frame(lines, line)
    {
        this.total_frame = Number(line)
    }

    //加载图层信息
    load_layers(lines, id, line)
    {
        let layer = {}
        let items = line.split(",")

        if(items[0] == "empty")
            return

        layer.name = items[0]
        layer.start_frame = Number(items[1])
        layer.stop_frame = Number(items[2])
        layer.bullet_emitter_count = Number(items[3])
        layer.laser_emitter_count = Number(items[4])
        layer.mask_count = Number(items[5])
        layer.rebound_borad_count = Number(items[6])
        layer.force_field_count = Number(items[7])

        this.load_layer_bullet_emitter(layer, lines)
        // this.load_layer_laser_emitter(layer, lines)
        // this.load_layer_mask(layer, lines)
        // this.load_layer_rebound_borad(layer, lines)
        // this.load_layer_force_field(layer, lines)

        this.layers[id] = layer
    }

    //加载某一个 layer 的子弹发射器
    load_layer_bullet_emitter(layer, lines)
    {
        let bullet_emitters = layer.bullet_emitters = {}
        let bullet_emitter_count = layer.bullet_emitter_count
        for(let i = 0; i < bullet_emitter_count; i++)
        {
            let line = lines.splice(0, 1)[0]
            let items = line.split(",")

            let bullet_emitter = {}
            let keys = ["id", "layer_id", "is_bound", "bound_id", "is_relative_bound_direction", "abandon1", "pos_x", "pos_y",
                        "start_frame", "stop_frame", "emmite_pos_x", "emmite_pos_y", "emmite_radius", "emmite_offset_angle",
                        "unkown_emmite_angle_pos", "bullet_count", "interval", "bullet_offset_angle", "unkown_bullet_offset_angle",
                        "range", "speed", "speed_direction", "unknow_speed_direction_pos", "speed_acc", "speed_acc_direction", "unknow_speed_acc_pos",
                        "bullet_life", "bullet_type", "bullet_scale_x", "bullet_scale_y", "bullet_R", "bullet_G", "bullet_B", "bullet_aplha",
                        "bullet_rotate_angle", "unknow_rotate_angle_pos", "bullet_face_speed_angle", "bullet_speed", "bullet_speed_direction",
                        "unknow_bullet_speed_direction_pos", "bullet_speed_acc", "bullet_speed_acc_direction", "unknow_bullet_speed_acc_direction_pos",
                        "speed_scale_x", "speed_scale_y", "atomization_effect", "erase_effect", "highlight_blend_effect", "drag_effect",
                        "erase_when_out", "invincible", "emmiter_events", "bullet_events", "emmite_pos_x_random", "emmite_pos_y_random",
                        "emmite_radius_random", "emmite_offset_angle_random", "bullet_count_random", "interval_random", "emitter_angle_random", "emitter_range_random", "speed_random",
                        "speed_direction_random", "speed_acc_random", "speed_acc_direction_random", "relative_direction_random", "bullet_speed_random",
                        "bullet_speed_direction_random", "bullet_speed_acc_random", "bullet_speed_acc_direction_random", "mask_effect",
                        "inverse_force_effect", "force_field_effect", "is_deep_bound"]

            this.fill_items(bullet_emitter, keys, items)

            //读入事件进行处理
            if(bullet_emitter.emmiter_events)
                bullet_emitter.emmiter_events = this.transfer_event_groups_from_config(bullet_emitter.emmiter_events)
            
            if(bullet_emitter.bullet_events)
                bullet_emitter.bullet_events = this.transfer_event_groups_from_config(bullet_emitter.bullet_events)

            bullet_emitters[bullet_emitter.id] = bullet_emitter
        }
    }

    //读入事件组
    transfer_event_groups_from_config(event_groups_string)
    {
        //作者写的格式非常麻烦，不知为何要用中文+字符串解析，而不是直接类似json或者已经是解析好的状态
        let event_group_strings = event_groups_string.split(";&")
        //删掉最后一个
        event_group_strings.splice(-1, 1)

        let event_groups = []

        for(let event_group_string of event_group_strings)
        {
            let event_group = {}
            let items = event_group_string.split("|")
            event_group.desc = items[0]
            event_group.interval = Number(items[1])
            event_group.interval_increasement = Number(items[2])

            let events_string = items[3]
            let event_strings = events_string.split(";")
            let events = []
            //小事件
            for(let event_string of event_strings)
            {
                let event = this.transfer_event_from_config(event_string)
                events.push(event)
            }   

            event_group.events = events

            event_groups.push(event_group)
        }

        return event_groups
    }

    //读入事件
    transfer_event_from_config(event_string)
    {
        let cond_pair_str = event_string.split("：")
        let cond_str = cond_pair_str[0]
        let effect_str = cond_pair_str[1]

        //读入条件信息
        let conds = this.analyse_cond_formula(cond_str)
        let vars = conds.vars
        let new_vars = []
        for(let one of vars)
        {
            let cond = this.anylyse_equalation_formula(one)
            new_vars.push(cond)
        }

        conds.vars = new_vars

        //读入效果信息
        let items = effect_str.split("，")
        effect_str = items[0]
        let effect = this.anylyse_effect_formula(effect_str)
        
        let effect_change = items[1]
        
        let effect_frame = items[2]

        let trans_frame = 0 //变化frame
        let patt = /([0-9]*).*/
        let trans_frame_ret = effect_frame.match(patt)
        if(trans_frame_ret)
        {
            trans_frame = Number(trans_frame_ret[1])
        }

        let trigger_times = 0 //触发次数，如果 0 则是无限
        patt = /.*\((.*)\)/
        let trigger_times_ret = effect_frame.match(patt)
        if(trigger_times_ret)
        {
            trigger_times = Number(trigger_times_ret[1])
        }

        return {
            conds,
            effect,
            effect_change,
            trans_frame,
            trigger_times
        }
    }

    // 或、且
    analyse_cond_formula(str)
    {
        let or_cond_strs = str.split("或")
        if(or_cond_strs.length > 1)
        {
            return {
                vars:or_cond_strs,
                op:"或",
            }
        }

        let and_cond_strs = str.split("且")
        if(and_cond_strs.length > 1)
        {
            return {
                vars:and_cond_strs,
                op:"且",
            }
        }

        return {
            vars:[str]
        }
    }

    //> < = 
    anylyse_equalation_formula(str)
    {
        let bigger_cond_strs = str.split(">")
        if(bigger_cond_strs.length > 1)
        {
            return {
                vars:bigger_cond_strs,
                op:">",
            }
        }

        let less_cond_strs = str.split("<")
        if(less_cond_strs.length > 1)
        {
            return {
                vars:less_cond_strs,
                op:"<",
            }
        }

        let equal_cond_strs = str.split("=")
        if(equal_cond_strs.length > 1)
        {
            return {
                vars:equal_cond_strs,
                op:"=",
            }
        }
    }

    //变化到、增加、减少
    anylyse_effect_formula(str)
    {
        let change_to_strs = str.split("变化到")
        if(change_to_strs.length > 1)
        {
            return {
                vars:change_to_strs,
                op:"变化到",
            }
        }

        let add_strs = str.split("增加")
        if(add_strs.length > 1)
        {
            return {
                vars:add_strs,
                op:"增加",
            }
        }

        let dec_strs = str.split("减少")
        if(dec_strs.length > 1)
        {
            return {
                vars:dec_strs,
                op:"减少",
            }
        }
    }

    //根据顺序来加载对应的元素
    fill_items(obj, keys, items)
    {
        for(let index = 0; index < items.length; index++)
        {
            let key = keys[index]
            let val = items[index]

            if(val === "")
                continue

            //检查一遍是不是 bool
            if(val == "True" || val == "False")
                val = (val == "True")
            //尝试转化数字
            else if(!isNaN(Number(val)))
                val = Number(val)
            else
            {
                //尝试转化json
                let val_obj = this.try_parse_json(val)
                if(val_obj)
                    val = val_obj
            }

            obj[key] = val
        }
    }

    try_parse_json(str) {
        if (typeof str == 'string') {
            try 
            {
                var obj = JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                    return obj;
                }else{
                    return false;
                }
    
            } catch(e) {
                return false;
            }
        }

        return false
    }
}
