// ==UserScript==
// @name         swagger_expand
// @namespace    https://github.com/qiujie8092916
// @version      2024-07-09
// @description  老版 swagger 自动展开
// @author       Jie.Q
// @match        https://**/*/swagger-ui.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant GM_log
// ==/UserScript==

(function() {
    'use strict';

    const retry_all_count = 50;

    let success = false;
    let retry_count = 1;
    let timer;

    const url = location.href;
    const hash = location.hash.substr(2) ?? '';
    const hashs = hash.split('/').map(it => decodeURIComponent(it));

    const main = () => {
        if(retry_count === retry_all_count || success) {
            return clearInterval(timer);
        }

        retry_count++;

        GM_log('retry_count', retry_count);

        const spans = document.querySelectorAll('div.swagger-ui .wrapper .block > div > span');

        if(spans?.length) {
            success = true;
            if (hashs[0]) {
                GM_log('hashs[0]', hashs[0]);

                const selectedTab = Array.from(spans).find(it => it.querySelector('div.opblock-tag-section > h4.opblock-tag')?.id === `operations-tag-${hashs[0]}`);

                if (selectedTab) {
                    const h4 = selectedTab.querySelector('div.opblock-tag-section > h4.opblock-tag');
                    h4?.click();

                    if(hashs[1]) {
                        GM_log('hashs[1]', hashs[1]);

                        const api_container = selectedTab.querySelector('div.opblock-tag-section.is-open').lastChild
                        const apis = api_container.querySelectorAll('& > span');
                        const api = Array.from(apis).find(it => it.querySelector('div.opblock').id === `operations-${hashs[0]}-${hashs[1]}`)

                        if(api) {
                            const div = api.querySelector('div.opblock-summary');
                            div?.click();
                            div?.scrollIntoView();
                        }
                    } else {
                        h4?.scrollIntoView();
                    }
                }

            } else {
                spans.forEach(it => {
                    const h4 = it.querySelector('div.opblock-tag-section > h4.opblock-tag');
                    h4.click();
                })
            }
            history?.replaceState?.(null, null, url);
        }
    }

    timer = setInterval(main, [500])
})();
