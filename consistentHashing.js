const crypto = require ("crypto")

class ConsistentHashing{
    constructor(servers=[],numReplicas=3){
        this.numReplicas=numReplicas
        this.ring=new Map()
        this.sortedKeys=[]
        this.servers=new Set()

        servers.forEach(server=>this.addServer(server))
    }

    _hash(key){
        const val=parseInt(crypto.createHash("md5").update(key).digest("hex"),16)
        return val
    }

    addServer(server){
        this.servers.add(server)

        for(let i=0;i<this.numReplicas;i++){
            const hash=this._hash(`${server}-${i}`)
            this.ring.set(hash,server)

            const idx=this.sortedKeys.findIndex((v)=>v>hash)
            if(idx==-1){
                this.sortedKeys.push(hash)
            }else{
                this.sortedKeys.splice(idx,0,hash)
            }

        }
    }


    removeServer(server){
        if(!this.servers.has(server))return

        this.servers.delete(server)

        for(let i=0;i<this.numReplicas;i++){
            const hash=this._hash(`${server}-${i}`)
            this.ring.delete(hash)

            const idx=this.sortedKeys.indexOf(hash)
            if(idx!==-1)this.sortedKeys.splice(idx,1)
        }
    }

    getServer(key){
        if(this.sortedKeys.length==0)return null

        const hashVal=this._hash(key)

        let left=0
        let right=this.sortedKeys.length-1

        while(left<=right){
            const mid=Math.floor((left+right)/2)

            if(this.sortedKeys[mid]<hashVal)left=mid+1
            else right=mid-1
        }

        let index=left%this.sortedKeys.length
        return this.ring.get(this.sortedKeys[index])
    }
}

const servers=['S0','S1','S2','S3','S4','S5']
const ch=new ConsistentHashing(servers)

console.log(`USERA ->`,ch.getServer("UserA"))
console.log(`USERB ->`,ch.getServer("UserB"))
console.log(ch.getServer("UserB"))