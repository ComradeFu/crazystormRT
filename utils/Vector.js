/**
 * 魔改过的 Vector，没办法谁让crazystorm没有长度也可以设置角度。。
 * 有些接口是没调教过的，注意
 */
module.exports = class Vector
{
    constructor(x, y)
    {
        this.__x = x || 0;
        this.__y = y || 0;

        this.symbol = 1; //符号
        this.__temp_angle = 0
    }

    get x()
    {
        return this.__x * this.symbol
    }

    get y()
    {
        return this.__y * this.symbol
    }

    set x(val)
    {
        this.__x = val * this.symbol
    }

    set y(val)
    {
        this.__y = val * this.symbol
    }

    getLength()
    {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)) * this.symbol
    }

    getMagnitude()
    {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    setAngle(angle) 
    {
        let r = this.getMagnitude();
        if (r == 0)
        {
            this.__temp_angle = angle
            return
        }

        this.__x = r * Math.cos(angle);
        this.__y = r * Math.sin(angle);
    }

    getAngle()
    {
        return Math.atan2(this.__y, this.__x)
    }

    add(vector)
    {
        this.__x += vector.x * this.symbol
        this.__y += vector.y * this.symbol
        return this;
    }

    addNew(vector)
    {
        let v = this.clone()
        v.add(vector)

        return v
    }

    subtract(vector)
    {
        this.__x -= vector.x * this.symbol
        this.__y -= vector.y * this.symbol
        return this
    }

    subtractNew(vector)
    {
        let v = this.clone()
        v.subtract(vector)

        return v
    }

    //点乘只负责计算出夹角，跟符号无关！
    dotProduct(vector)
    {
        return this.__x * vector.__x + this.__y * vector.__y
    }

    hadamardProduct(vector)
    {
        this.__x *= vector.x
        this.__y *= vector.y
    }

    hadamardProductNew(vector)
    {
        let new_vec = this.clone()
        new_vec.hadamardProduct(vector)

        return new_vec
    }

    rotate(angle)
    {
        //正余弦差角公式
        let ca = Math.cos(angle);
        let sa = Math.sin(angle);

        let rx = this.__x * ca - this.__y * sa;
        let ry = this.__x * sa + this.__y * ca;
        this.__x = rx;
        this.__y = ry;
    }

    // 由两点生成边
    edge(vector)
    {
        return this.subtract(vector)
    }

    // 垂直，即投影轴
    perpendicular()
    {
        let v = new Vector()
        v.__x = this.__y
        v.__y = 0 - this.__x
        v.symbol = this.symbol

        return v
    }

    //标准化还是按照角度来吧
    normalize()
    {
        let v = new Vector(0, 0);
        let m = this.getMagnitude()

        if (m !== 0)
        {
            v.x = this.__x / m
            v.y = this.__y / m
        }
        return v
    }

    setLength(len)
    {
        //保留符号
        if (len >= 0)
        {
            this.symbol = 1
        }
        else
        {
            this.symbol = -1
        }
        let symbol = this.symbol
        len *= symbol

        let m = this.getMagnitude();
        if (m == 0)
        {
            this.__x = len
            this.setAngle(this.__temp_angle)
        }
        else
        {
            this.__x = this.__x * len / m;
            this.__y = this.__y * len / m;
        }

        return this;
    }

    scaleNew(s)
    {
        let v = this.clone()
        v.__x *= s;
        v.__y *= s;
        return v;
    }

    // 投影轴的单位向量
    normal()
    {
        let p = this.perpendicular()
        return p.normalize()
    }

    //90度
    rotateLeft()
    {
        let vec = this.clone()
        vec.__x = this.__y
        vec.__y = -this.__x

        return vec
    }

    rotateRight()
    {
        let vec = this.clone()
        vec.__x = -this.__y
        vec.__y = this.__x

        return vec
    }

    fromPolar(r, a)
    {
        this.x = r * Math.cos(a);
        this.y = r * Math.sin(a);
        return this;
    }

    //投影
    project(another)
    {
        let ret = another.clone()

        let len = this.dotProduct(another) / another.getLength();

        ret.setLength(len)

        return ret
    }

    compare_equal(vec)
    {
        if (this.x == vec.x && this.y == vec.y)
            return true

        return false
    }

    clone()
    {
        let vec = new this.constructor()
        vec.symbol = this.symbol
        vec.__x = this.__x
        vec.__y = this.__y
        vec.__temp_angle = this.__temp_angle

        return vec
    }
}
