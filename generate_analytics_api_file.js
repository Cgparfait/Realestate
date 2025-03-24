const fs = require("fs")
const path = require("path")
require("dotenv").config()

const analytics_key_file_name = process.env.ANALYTICS_API_KEY_FILE_NAME

const analytics_key_file_data = process.env.ANALYTICS_API_KEY_FILE

// if (!fs.existsSync(".secret")) {
//     fs.mkdirSync(".secret", { recursive: true });
//     console.log(`Folder created: ${".secret"}`);
// }
// else {
//     fs.rmdirSync(".secret")
//     console.log("secret forder deleted")
// }



secret_folder_name = process.env.SECRET_FOLDER_NAME
filePath = path.join(secret_folder_name + "/" + analytics_key_file_name)

// delete and re-create directory
resetDir(secret_folder_name)
fs.writeFile(filePath, analytics_key_file_data, (err) => {
    if (err) console.error({ message: "could not create analytics key file", error: err })
    else console.log("analytics key file created successfuly!")
})


function resetDir(dirName) {
    removeDir(dirName)
    createDir(dirName)
}
function removeDir(dirName) {
    fs.rmSync(dirName, { recursive: true, force: true })
}
function createDir(dirName) {
    fs.mkdirSync(dirName, { recursive: true });
    console.log(`Folder created: ${dirName}`);
}