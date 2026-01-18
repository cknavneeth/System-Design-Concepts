class IPHashing{
    constructor(servers){
        this.servers = servers
    }

    IpHash(ip){
        let hash=0
        for(let i = 0;i < ip.length; i++){
            hash = (hash << 5) - hash + ip.charCodeAt(i)
            hash |= 0 //keeping a 32 bit integer here
        }

        return Math.abs(hash)
    }

    getNextServer(clientIp){
        let index=this.IpHash(clientIp)%this.servers.length
        return this.servers[index]
    }
}

let servers = [ "Server1" , "Server2" , "Server3" ]

let sys = new IPHashing(servers)

let ips = [ "192.168.0.1" , "192.168.0.2" , "192.168.0.3" ]

ips.forEach((ip)=>{
    console.log(`${ip}=> ${sys.getNextServer(ip)}`)
})