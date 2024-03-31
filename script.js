// Dependencies: langchain, inquirer, dotenv
require('dotenv').config();
const inquirer = require('inquirer');
const { OpenAI } = require('langchain/llms/openai');
// The following dependencies are not required for this script to run, but are used to format the output
const { PromptTemplate } = require("langchain/prompts");
const { StructuredOutputParser } = require("langchain/output_parsers");
// Creates and stores a wrapper for the OpenAI package along with basic configuration
const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    model: 'gpt-3.5-turbo'
});

console.log({ model });
// With a `StructuredOutputParser` we can define a schema for the output.
const parser = StructuredOutputParser.fromNamesAndDescriptions({
    // Define the output variables and their descriptions
    code: "Javascript code that answers the user's question",
    explanation: "detailed explanation of the example code provided",

});
// Get the format instructions from the parser
const formatInstructions = parser.getFormatInstructions()
//Used the instantiated OpenAI wrapper, model, and makes a call based on Input from inquirer
const promptFunc = async (input) => {

    try {
        const prompt = new PromptTemplate({
            // Define the template for the prompt
            template: "You are a javascript expert and will answer the user's coding questions thoroughly as possible.\n{question}",
            inputVariables: ["question"],
            partialVariables: { format_instructions: formatInstructions }
        });
        // Format the prompt with the user input
        const promptInput = await prompt.format({
            question: input
        });

        // Call the model with the formatted prompt
        const res = await model.call(promptInput);
        console.log(await parser.parse(res));
        // Catch any errors and log them to the console   
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
            message: 'Ask a coding question',
        },
    ]).then((inquirerResponse) => {
        promptFunc(inquirerResponse.name)
    });
};
//Calls the initalization function and starts the script
init();
