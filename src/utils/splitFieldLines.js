module.exports = (fieldTitle, fieldText) => { // // Exports the following code for it to be used externally
    try { // Attempts to create multi-line paragraphed field
        const fieldTextLines = fieldText.split("\\n"); // The \ before \n means literal \n is recognised
        const embedFields = []; // Fields for the embed message

        embedFields.push({ name: fieldTitle, value: fieldTextLines[0] }); // Creates the first paragraph
        for (let i = 1; i < fieldTextLines.length; i++) { // Iterates through the remaining paragraphs in the field
            embedFields.push({ name: " ", value: "\n" }); // Adds a field with an empty field title and field text to replicate a new line
            embedFields.push({ name: " ", value: fieldTextLines[i] }); // Adds a paragraph
        }

        return embedFields; // Returns the fields split into different paragraphs
    } catch (error) { // Catches and reports any errors
        console.error(`\nSplit Field Lines ERROR: \n${error}\n`);
        return;
    }
};
