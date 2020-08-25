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
        this.center = {
            layers: {}
        }

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

        while (lines.length > 0)
        {
            let line = lines.splice(0, 1)[0]
            let pair = line.split(":")

            let key = pair[0]
            let val = pair[1]

            switch (key)
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
                    global.console.error(`无法识别的配置:${key}`)
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
        center.pos = [Number(items[0]), Number(items[1])]
        center.speed = Number(items[2])
        center.speed_angle = Number(items[3])
        center.speed_acc = Number(items[4])
        center.speed_acc_angle = Number(items[5])
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

        if (items[0] == "empty")
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

        this.center.layers[id] = layer
    }

    //加载某一个 layer 的子弹发射器
    load_layer_bullet_emitter(layer, lines)
    {
        let bullet_emitters = layer.bullet_emitters = {}
        let bullet_emitter_count = layer.bullet_emitter_count
        for (let i = 0; i < bullet_emitter_count; i++)
        {
            let line = lines.splice(0, 1)[0]
            let items = line.split(",")

            let bullet_emitter = {}
            let keys = ["id", "layer_id", "is_bound", "bound_id", "is_relative_bound_direction", "abandon1", "pos_x", "pos_y",
                "start_frame", "stop_frame", "emmite_pos_x", "emmite_pos_y", "emmite_radius", "emmite_offset_angle",
                "unkown_emmite_angle_pos", "bullet_count", "interval", "bullet_offset_angle", "unkown_bullet_offset_angle",
                "range", "speed", "speed_angle", "unknow_speed_angle_pos", "speed_acc", "speed_acc_angle", "unknow_speed_acc_pos",
                "bullet_life", "bullet_type", "bullet_scale_x", "bullet_scale_y", "bullet_R", "bullet_G", "bullet_B", "bullet_alpha",
                "bullet_rotate_angle", "unknow_rotate_angle_pos", "bullet_face_speed_angle", "bullet_speed", "bullet_speed_angle",
                "unknow_bullet_speed_angle_pos", "bullet_speed_acc", "bullet_speed_acc_angle", "unknow_bullet_speed_acc_angle_pos",
                "speed_scale_x", "speed_scale_y", "atomization_effect", "erase_effect", "highlight_blend_effect", "drag_effect",
                "erase_when_out", "invincible", "emmiter_events", "bullet_events", "emmite_pos_x_rand", "emmite_pos_y_rand",
                "emmite_radius_rand", "emmite_offset_angle_rand", "bullet_count_rand", "interval_rand", "emitter_angle_rand", "emitter_range_rand", "speed_rand",
                "speed_angle_rand", "speed_acc_rand", "speed_acc_angle_rand", "relative_direction_rand", "bullet_speed_rand",
                "bullet_speed_angle_rand", "bullet_speed_acc_rand", "bullet_speed_acc_angle_rand", "mask_effect",
                "inverse_force_effect", "force_field_effect", "is_deep_bound"]

            this.fill_items(bullet_emitter, keys, items)

            //位置信息
            bullet_emitter.pos = [bullet_emitter.pos_x, bullet_emitter.pos_y]

            //读入事件进行处理
            if (bullet_emitter.emmiter_events)
                bullet_emitter.emmiter_events = this.transfer_event_groups_from_config(bullet_emitter.emmiter_events)

            if (bullet_emitter.bullet_events)
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

        for (let event_group_string of event_group_strings)
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
            for (let event_string of event_strings)
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
        for (let one of vars)
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
        let patt = /([0-9]*).*/u
        let trans_frame_ret = effect_frame.match(patt)
        if (trans_frame_ret)
        {
            trans_frame = Number(trans_frame_ret[1])
        }

        let trigger_times = 0 //触发次数，如果 0 则是无限
        patt = /.*\((.*)\)/u
        let trigger_times_ret = effect_frame.match(patt)
        if (trigger_times_ret)
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
        if (or_cond_strs.length > 1)
        {
            return {
                vars: or_cond_strs,
                op: "或",
            }
        }

        let and_cond_strs = str.split("且")
        if (and_cond_strs.length > 1)
        {
            return {
                vars: and_cond_strs,
                op: "且",
            }
        }

        return {
            vars: [str]
        }
    }

    //> < = 
    anylyse_equalation_formula(str)
    {
        let bigger_cond_strs = str.split(">")
        if (bigger_cond_strs.length > 1)
        {
            return {
                condition_name: bigger_cond_strs[0],
                op: ">",
                condition_val: bigger_cond_strs[1]
            }
        }

        let less_cond_strs = str.split("<")
        if (less_cond_strs.length > 1)
        {
            return {
                condition_name: less_cond_strs[0],
                op: "<",
                condition_val: less_cond_strs[1]
            }
        }

        let equal_cond_strs = str.split("=")
        if (equal_cond_strs.length > 1)
        {
            return {
                condition_name: equal_cond_strs[0],
                op: "=",
                condition_val: equal_cond_strs[1]
            }
        }
    }

    //变化到、增加、减少
    anylyse_effect_formula(str)
    {
        let change_to_strs = str.split("变化到")
        if (change_to_strs.length > 1)
        {
            return {
                effect_name: change_to_strs[0],
                op: "变化到",
                target_val: Number(change_to_strs[1])
            }
        }

        let add_strs = str.split("增加")
        if (add_strs.length > 1)
        {
            return {
                effect_name: change_to_strs[0],
                op: "增加",
                target_val: Number(change_to_strs[1])
            }
        }

        let dec_strs = str.split("减少")
        if (dec_strs.length > 1)
        {
            return {
                effect_name: change_to_strs[0],
                op: "减少",
                target_val: Number(change_to_strs[1])
            }
        }

        return {
            effect_name: change_to_strs[0],
        }
    }

    //根据顺序来加载对应的元素
    fill_items(obj, keys, items)
    {
        for (let index = 0; index < items.length; index++)
        {
            let key = keys[index]
            let val = items[index]

            if (val === "")
                continue

            //检查一遍是不是 bool
            if (val == "True" || val == "False")
                val = (val == "True")
            //尝试转化数字
            else if (isNaN(Number(val)) == false)
                val = Number(val)
            else
            {
                //尝试转化json
                let val_obj = this.try_parse_json(val)
                if (val_obj)
                    val = val_obj
            }

            obj[key] = val
        }
    }

    try_parse_json(str)
    {
        if (typeof str == 'string')
        {
            try 
            {
                let obj = JSON.parse(str);
                if (typeof obj == 'object' && obj)
                {
                    return obj;
                }
                else
                {
                    return false;
                }

            }
            catch (e)
            {
                return false;
            }
        }

        return false
    }
}
