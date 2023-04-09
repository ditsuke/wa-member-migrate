import wa from '@open-wa/wa-automate';

/**
 * @returns {wa.Client}
 */
const initClient = async () => {
    const client = await wa.create({
        sessionId: "ALiAS-Migrator",
        multiDevice: true,
        authTimeout: 60,
        blockCrashLogs: true,
        disableSpins: true,
        headless: true,
        hostNotificationLang: 'EN_US',
        qrTimeout: 0,
    });

    return client;
}

/**
 * Migrate members from one group to another.
 * 
 * @param {wa.Client} client 
 * @param {wa.GroupChatId} sourceGroupId 
 * @param {wa.GroupChatId} targetGroupId 
 */
const migrateMembers = async (client, sourceGroupId, targetGroupId) => {
    // TODO: filter out members in target group (to avoid errors while adding them)
    const sourceMembers = (await client.getGroupMembers(sourceGroupId)).map(member => member.id);
    addMembersInBatches(client, sourceMembers, targetGroupId);
}

/**
 * Identify IDs of groups to target
 * 
 * @param {wa.Client} client 
 * @param {String} keyword 
 */
const printMatchingGroups = async (client, keyword) => {
    const r = RegExp(keyword, 'i');
    const groups = (await client.getAllGroups()).filter(group => group.contact.formattedName.match(r));
    for (const group of groups) {
        console.log(`group: ${group.contact.formattedName}; id = ${group.id}`);
    }
}

/**
 * Add members to group in batches of 10 with a 5 second delay between batches, a scaredy-cat approach to avoid being blocked (phrase brought to you by copilot).
 * 
 * @param {wa.Client} client 
 * @param {wa.ContactId[]} sourceMembers 
 * @param {wa.GroupChatId} groupId 
 */
const addMembersInBatches = async (client, sourceMembers, groupId) => {
    const batchedSourceMembers = (() => {
        const batched = [];
        for (let i = 0; i < sourceMembers.length; i += 10) {
            batched.push(sourceMembers.slice(i, i + 10));
        }
        return batched;
    })();

    for (const [i, batch] of batchedSourceMembers.entries()) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        try {
            const done = await client.addParticipant(groupId, batch);
            console.log(`add batch ${i} = ${done}`);
        } catch (e) {
            console.log(`add batch ${i} failed: ${e}`);
        }
    }
}