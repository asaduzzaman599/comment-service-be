import app from "./app"
import config from "./app/config"
import  {connectDB} from "./db_client"


function main(){
    try{
        connectDB()
        


        app.listen(config.PORT, () => {
        console.log(`Server listening on port ${config.PORT}`)
        })
        
    }catch(e){
        console.error(e)
    }finally{

    }
}
main()