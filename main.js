// ==UserScript==
// @name         redmine_issues_gantt
// @namespace    https://github.com/qiujie8092916
// @version      2024-06-18
// @description  持久化 redmine issues gantt 表格列宽
// @author       Jie.Q
// @match        https://*/**/issues/gantt*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_log
// ==/UserScript==

(function() {
    'use strict';

    const MAIN_CLASS = 'gantt_subjects_column';
    const STORE_NAME = 'persist_redmine_gantt_table_width';

    function isNumber(value) {
        return typeof value === 'number' && !isNaN(value);
    }

    function iteratorWidth(ml, width, isMain) {
        if (isMain) {
            const container = ml.querySelector('.gantt_subjects_container');
            container.style.width = `${width}px`;

            const mainItems = container.querySelectorAll('.gantt_subjects form > div');

            [...mainItems].filter(it => it.style.position === 'absolute').forEach(it => {
                const left = parseFloat(window.getComputedStyle(it).left);
                        GM_log('left', left);

                it.style.width = `${width - (isNumber(left) ? left : 0)}px`;
            })
        } else {
            ml.querySelectorAll('.gantt_selected_column_container').forEach(it => {
                it.style.width = `${width}px`;
            })
        }

        ml.querySelectorAll('.gantt_hdr').forEach(it => {
            it.style.width = `${width}px`;
        })
    }

    function wrapperWidth(ml, width, isMain = false) {
        ml.style.width = `${width}px`;
        iteratorWidth(ml, width, isMain);
    }

    function initWidth(table) {
        const persist_width = GM_getValue(STORE_NAME, {});

        const tds = table.querySelectorAll('tbody > tr > td');

        for (const sign in persist_width) {
            if (persist_width.hasOwnProperty(sign)) {
                const width = persist_width[sign];

                // 兼容特殊的主列没有 id
                if (sign === MAIN_CLASS) {
                    const item = [...tds].find(it => it.classList.contains(sign));

                    if (item && isNumber(persist_width[sign])) {
                        wrapperWidth(item, persist_width[sign], true);
                    }
                } else {
                    const item = [...tds].find(it => it.id === sign);

                    if (item && isNumber(persist_width[sign])) {
                        wrapperWidth(item, persist_width[sign]);
                    }
                }
            }
        }
    }

    function listenerWidth (table) {
        const persist_width = GM_getValue(STORE_NAME, {});

        GM_log('listener get', persist_width);

        const tds = table.querySelectorAll('tbody > tr > td');

        tds.forEach(it => {
            const resizable_handle = it.querySelector('.ui-resizable-handle.ui-resizable-e');

            if (resizable_handle) {
                resizable_handle.addEventListener('mouseup', function (e) {
                    try {
                        if (e.target && e.target.parentElement) {
                            const td = e.target.parentElement;
                            const id = td.id;
                            const width = parseFloat(window.getComputedStyle(td).width);

                            if (isNumber(width)) {
                                // 兼容特殊的主列没有 id
                                if (!id && td.classList.contains(MAIN_CLASS)) {
                                    persist_width[MAIN_CLASS] = width;
                                } else {
                                    persist_width[id] = width;
                                }
                            }


                            GM_log('listener set', persist_width);

                            GM_setValue(STORE_NAME, persist_width);
                        }
                    } catch (e) {
                        GM_log(e);
                    }
                })
            }
        })
    }

    const table = document.querySelector('table.gantt-table');

    if (table) {
        // 重置持久化数据
        // GM_deleteValue(STORE_NAME)

        // 监听宽度变化
        listenerWidth(table);

        // 初始化宽度
        initWidth(table);
    }
})();
