/**
 * 魔改过的 Vector，没办法谁让crazystorm没有长度也可以设置角度。。
 */
module.exports = class Vector
{
    constructor(x, y)
    {
        this.x = x || 0;
        this.y = y || 0;

        this.__temp_angle = 0
    }
    getLength()
    {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }
    getMagnitude()
    {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }
    setAngle(angle) 
    {
        let r = this.getLength();
        if (r == 0)
        {
            this.__temp_angle = angle
            return
        }

        this.x = r * Math.cos(angle);
        this.y = r * Math.sin(angle);
    }
    getAngle()
    {
        return Math.atan2(this.y, this.x)
    }
    add(vector)
    {
        this.x = this.x + vector.x
        this.y = this.y + vector.y
        return this;
    }
    addNew(vector)
    {
        let v = new Vector()
        v.x = this.x + vector.x
        v.y = this.y + vector.y
        return v
    }
    subtract(vector)
    {
        this.x = this.x - vector.x
        this.y = this.y - vector.y
        return this
    }
    subtractNew(vector)
    {
        let v = new Vector()
        v.x = this.x - vector.x
        v.y = this.y - vector.y
        return v
    }

    dotProduct(vector)
    {
        return this.x * vector.x + this.y * vector.y
    }

    hadamardProduct(vector)
    {
        this.x *= vector.x
        this.y *= vector.y
    }

    hadamardProductNew(vector)
    {
        let new_vec = this.clone()
        new_vec.hadamardProduct(vector)

        return new_vec
    }

    rotate(angle)
    {
        let ca = Math.cos(angle);
        let sa = Math.sin(angle);

        let rx = this.x * ca - this.y * sa;
        let ry = this.x * sa + this.y * ca;
        this.x = rx;
        this.y = ry;
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
        v.x = this.y
        v.y = 0 - this.x
        return v
    }

    normalize()
    {
        let v = new Vector(0, 0);
        let m = this.getLength()

        if (m !== 0)
        {
            v.x = this.x / m
            v.y = this.y / m
        }
        return v
    }

    setLength(len)
    {
        let m = this.getLength();
        if (m == 0)
        {
            this.x = len
            this.setAngle(this.__temp_angle)
        }
        else
        {
            this.x = this.x * len / m;
            this.y = this.y * len / m;
        }

        return this;
    }
    scaleNew(s)
    {
        let v = new Vector(this.x, this.y);
        v.x *= s;
        v.y *= s;
        return v;
    }
    // 投影轴的单位向量
    normal()
    {
        let p = this.perpendicular()
        return p.normalize()
    }
    rotateLeft()
    {
        return new Vector(this.y, -this.x);
    }
    rotateRight()
    {
        return new Vector(-this.y, this.x);
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
        return new this.constructor(this.x, this.y)
    }
}
