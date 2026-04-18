#!/usr/bin/env node
import Micron from './micron.js';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import chalk from 'chalk';
import header from './assets/header.js';

const optionDefinitions = [
    {name: 'folder', defaultOption: true, type: String},
    {name: 'sweep', type: String},
    {name: 'start', alias: 's', type: Number},
    {name: 'end', alias: 'e', type: Number},
    {name: 'step', alias: 'i', type: Number},
    {name: 'repeats', alias: 'r', type: Number},
    {name: 'verbose', alias: 'v', type: Boolean},
    {name: 'outdir', alias: 'o', type: String},
    {name: 'json', alias: 'j', type: Boolean},
    {name: 'quiet', alias: 'q', type: Boolean},
    {name: 'help', alias: 'h', type: Boolean}
];

const sections = [
    {
        content: chalk.green(header),
        raw: true
    },
    {
        header: 'Micron - benchmark runner',
        content: ['Run your performance benchmarks and visualize how they scale.']
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'folder',
                typeLabel: '{underline dir}',
                defaultOption: true,
                description: 'Benchmarks folder (default: ./benchmarks).'
            },
            {
                name: 'sweep',
                typeLabel: '{underline start:end:step}',
                description: 'Shorthand for --start, --end, --step (e.g. 100:5000:500).'
            },
            {
                name: 'start',
                typeLabel: '{underline integer}',
                description: 'Initial N (default: 100).'
            },
            {
                name: 'end',
                typeLabel: '{underline integer}',
                description: 'Final N (default: 2100).'
            },
            {
                name: 'step',
                typeLabel: '{underline integer}',
                description: 'Step between N values (default: 500).'
            },
            {
                name: 'repeats',
                typeLabel: '{underline integer}',
                description: 'Repeats per step (default: 3).'
            },
            {
                name: 'outdir',
                typeLabel: '{underline path}',
                description: 'Output folder for results (default: ./results).'
            },
            {
                name: 'json',
                description: 'Output results as JSON to stdout (CI-friendly, skips HTML).'
            },
            {
                name: 'quiet',
                description: 'Suppress all output except errors.'
            },
            {
                name: 'help',
                description: 'Print this usage guide.'
            }
        ]
    },
    {
        header: 'Examples',
        content: [
            {colA: 'Basic:', colB: '$ micron-runner'},
            {colA: 'Custom folder:', colB: '$ micron-runner ./my-benchmarks'},
            {colA: 'Sweep shorthand:', colB: '$ micron-runner --sweep 100:5000:500'},
            {colA: 'CI JSON output:', colB: '$ micron-runner --json > results.json'}
        ]
    }
];

const usage = commandLineUsage(sections);

let options;
try {
    options = commandLineArgs(optionDefinitions);
    if(options.help) {
        console.log(usage);
        process.exit(0);
    }
} catch(e) {
    console.log(usage);
    process.exit(1);
}

if(options.sweep) {
    const parts = options.sweep.split(':').map(Number);
    if(parts.length !== 3 || parts.some(isNaN)) {
        console.error('MicronError: --sweep format must be start:end:step (e.g. 100:5000:500)');
        process.exit(1);
    }
    const [start, end, step] = parts;
    options.start = options.start ?? start;
    options.end = options.end ?? end;
    options.step = options.step ?? step;
    delete options.sweep;
}

const runner = new Micron(options);

runner
    .run()
    .catch((error) => {
        console.error(error.message);
        process.exit(1);
    });
