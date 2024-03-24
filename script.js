// dependencies
require('dotenv').config();
const inquirer = require('inquirer');
const { OpenAI } = require('langchain/llms/openai');
// Creates and stores a wrapper for the OpenAI package along with basic configuration
const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    model: 'gpt-3.5-turbo'
});

console.log({ model });
//Used the instantiated OpenAI wrapper, model, and makes a call based on Input from inquirer
const promptFunc = async (input) => {

    try {
        const res = await model.call(input);
        console.log(res);
    }
    catch (err) {
        console.error(err);
    }
};
// Initalization function that uses inquirer to prompt the user and returns a promise
const init = () => {                //It takes the user input and passes it through the call method
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Ask a  coding question',
        },
    ]).then((inquirerResponse) =>{
        promptFunc(inquirerResponse.name)
    });
};
//Calls the initalization function and starts the script
init();


