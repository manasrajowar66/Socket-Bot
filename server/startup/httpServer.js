require('dotenv').config();

module.exports = async(server)=>{
    const port = process.env.PORT || process.env.SERVER_PORT;
    server.listen(port,()=>{
        console.log(`Server running on http://localhost:${port}`);
    })
}