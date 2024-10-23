#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDir = path.join(__dirname, '..');
const localesDir = path.join(clientDir, 'public', 'locales');
const defaultLang = 'he';
const supportedLangs = ['he', 'en'];

const program = new Command();

program
    .version('1.0.0')
    .description('CLI to manage i18n translations for the client app');

program
    .command('setup')
    .description('Setup the locales folder structure')
    .action(async () => {
        try {
            await fs.ensureDir(localesDir);
            for (const lang of supportedLangs) {
                const langDir = path.join(localesDir, lang);
                await fs.ensureDir(langDir);
                const translationFile = path.join(langDir, 'translation.json');
                if (!await fs.pathExists(translationFile)) {
                    await fs.writeJson(translationFile, {});
                }
            }
            console.log(chalk.green('Folder structure created successfully!'));
        } catch (error) {
            console.error(chalk.red('Error setting up folder structure:'), error);
        }
    });

program
    .command('add')
    .description('Add a new translation')
    .action(async () => {
        try {
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'key',
                    message: 'Enter the translation key (e.g., "common.newKey"):',
                    validate: input => input.trim() !== '' || 'Key cannot be empty'
                },
                {
                    type: 'input',
                    name: 'defaultValue',
                    message: `Enter the value for the default language (${defaultLang}):`,
                },
                {
                    type: 'confirm',
                    name: 'addOthers',
                    message: 'Do you want to add values for other languages?',
                    default: false
                }
            ]);

            const translations = {
                [defaultLang]: answers.defaultValue
            };

            if (answers.addOthers) {
                for (const lang of supportedLangs) {
                    if (lang !== defaultLang) {
                        const { value } = await inquirer.prompt({
                            type: 'input',
                            name: 'value',
                            message: `Enter the value for ${lang} (press enter to skip):`,
                        });
                        translations[lang] = value;
                    }
                }
            }

            for (const lang of supportedLangs) {
                const filePath = path.join(localesDir, lang, 'translation.json');
                let content = await fs.readJson(filePath);

                const keys = answers.key.split('.');
                let current = content;
                for (let i = 0; i < keys.length; i++) {
                    if (i === keys.length - 1) {
                        current[keys[i]] = translations[lang] || '';
                    } else {
                        current[keys[i]] = current[keys[i]] || {};
                        current = current[keys[i]];
                    }
                }

                await fs.writeJson(filePath, content, { spaces: 2 });
                console.log(chalk.green(`Updated ${lang}/translation.json`));
            }
        } catch (error) {
            console.error(chalk.red('Error adding translation:'), error);
        }
    });

program.parse(process.argv);