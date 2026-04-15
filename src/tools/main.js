/**
 * MJWTools
 * 
 * Licensed under
 * Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en
 * 
 * [[Category:ガジェット/MJWTools]]
 * <nowiki>
 */
(() => {
    const Vue = require('vue');

    const ToolList = [
        "time",
        "energy",
        "banner",
        "seed",
    ];

    document.querySelectorAll("div.mjw-tool").forEach((tool) => {
        const toolName = tool.getAttribute("data-name");
        if (!toolName || (toolName && !ToolList.includes(toolName.trim()))) {
            console.warn(`[MJW Tools] Invalid tool name detected: ${toolName}`);
            return;
        } else {
            console.log(`[MJW Tools] Tool detected: ${toolName}`);
        }

        const toolVue = require(`./MJWTools/Tool-${toolName.trim()}.vue`);

        const VueApp = Vue.createMwApp(toolVue, {});
        tool.innerHTML = ""
        VueApp.mount(tool.appendChild(document.createElement('div')));
    });
})();
