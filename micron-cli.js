#!/usr/bin/env node
'use strict';
const Micron = require('./micron');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const chalk = require('chalk');
const header = require('./assets/header');
const optionDefinitions = [
    {name: 'folder', defaultOption: true},
    {name: 'start', alias: 's', type: Number},
    {name: 'end', alias: 'e', type: Number},
    {name: 'step', alias: 'i', type: Number},
    {name: 'repeats', alias: 'r', type: Number},
    {name: 'verbose', alias: 'v', type: Boolean},
    {name: 'outdir', alias: 'o', type: Boolean},
    {name: 'help', alias: 'h', type: Boolean}
];
const sections = [
    {
        content: chalk.green(header),
        raw: true
    },
    {
        header: 'Micron - benchmark runner',
        content: [
            'Run your performance benchmark easier than ever.'
        ]
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'folder',
                typeLabel: '{underline dir}',
                defaultOption: true,
                description: 'The input folder.'
            },
            {
                name: 'start',
                typeLabel: '{underline integer}',
                description: 'Initial amount of executions in the loop.'
            },
            {
                name: 'end',
                typeLabel: '{underline integer}',
                description: 'End amount of executions in the loop.'
            },
            {
                name: 'step',
                typeLabel: '{underline integer}',
                defaultOption: true,
                description: 'Step from start to end.'
            },
            {
                name: 'repeats',
                typeLabel: '{underline integer}',
                defaultOption: true,
                description: 'Reapets for each loop.'
            },
            {
                name: 'outdir',
                typeLabel: '{underline path}',
                defaultOption: true,
                description: 'Outdir for save results.'
            },
            {
                name: 'help',
                description: 'Print this usage guide.'
            }
        ]
    },
    {
        header: 'Examples',
        content:[
            {colA: 'Basic Example:', colB: '$ micron test'},
            {colA: 'With Args:', colB: '$ micron test --start 200 --end 2200 --step 500 -r 3'}
        ]
    }
];
const usage = commandLineUsage(sections);
let options;
try {
    options = commandLineArgs(optionDefinitions);
    if(options.help) {
        console.log(usage);
        return;
    }
} catch (e) {
    console.log(usage);
    return;
}


const runner = new Micron(options);

runner
    .run();
