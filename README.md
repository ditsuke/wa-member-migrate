# wa-member-migrate

A simple JavaScript program to migrate members from one WhatsApp group to another using the [wa-automate](https://github.com/open-wa/wa-automate-nodejs) library.

## Installation

To use this program, you need to have Node.js installed on your computer. Clone or download this repository and navigate to the directory in your terminal. Run the following command to install the required dependencies:

```
yarn install
```

## Usage

The `migrateMembers` function in `main.js` can be used to migrate members from one group to another. You need to provide the `sourceGroupId` and `targetGroupId` as parameters to this function. For example:

```javascript
const client = await initClient();
const sourceGroupId = '1234567890@g.us'; // replace with your source group ID
const targetGroupId = '0987654321@g.us'; // replace with your target group ID
await migrateMembers(client, sourceGroupId, targetGroupId);
```

To identify the group IDs of your WhatsApp groups, you can use the `printMatchingGroups` function. This function takes a `keyword` parameter and prints the names and IDs of all groups whose names match the keyword. For example:

```javascript
const client = await initClient();
await printMatchingGroups(client, 'ALiAS'); // replace ALiAS with your keyword
```

This will print the names and IDs of all groups whose names contain the word "family".

Note that this program adds members to the target group in batches of 10 with a 5-second delay between batches to avoid being blocked by WhatsApp. If any errors occur while adding members, they will be logged to the console.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.