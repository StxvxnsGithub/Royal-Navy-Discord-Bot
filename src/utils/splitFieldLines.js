module.exports = (fieldTitle, fieldText) => {
    try {
        const fieldTextLines = fieldText.split("\\n");
        const embedFields = [];

        embedFields.push({ name: fieldTitle, value: fieldTextLines[0] });
        for (let i = 1; i < fieldTextLines.length; i++) {
            embedFields.push({ name: " ", value: "\n" });
            embedFields.push({ name: " ", value: fieldTextLines[i] });
        }

        return embedFields;
    } catch (error) {
        console.error(`\nSplit Field Lines ERROR: \n${error}\n`);
        return;
    }
};
