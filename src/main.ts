import app from "./app"
import config from "./app/config"
import dbClient, {connectDB} from "./db_client"


function main(){
    try{
        connectDB()
        


        app.listen(config.PORT, () => {
        console.log(`Server listening on port ${config.PORT}`)
        })
        app.get('/', (req, res) => {
        res.send('Hello World!')
        })
    }catch(e){
        console.error(e)
    }finally{

    }
}
main()