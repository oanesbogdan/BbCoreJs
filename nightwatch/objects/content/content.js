/*
 * Copyright (c) 2011-2016 Lp digital system
 *
 * This file is part of BackBee.
 *
 * BackBee is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBee is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBee. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Page object
 *
 * @category    NightWatch
 * @subcategory PageObjects
 * @copyright   Lp digital system
 * @author      flavia.fodor@lp-digital.fr
 */

module.exports = {
    sections: {
        article: {
            selector: '[data-bb-identifier^="Article/Article"]:first',
            sections: {
                plugins: {
                    selector : 'div.bb5-ui.bb5-content-actions.content-actions',
                    elements: {
                        pencil: {
                            selector: 'a.fa.fa-pencil'
                        },
                        infoCircle: {
                            selector: 'a.fa.fa-info-circle'
                        },
                        cog: {
                            selector: 'a.fa.fa-cog'
                        }
                    }
                }
            },
            elements: {
                contentSelected: {
                    selector: '.bb-content.bb-dnd.bb-content-selected[data-bb-identifier^="Article/Article"]'
                },
                contentPlugins: {
                    selector: '.bb-content.bb-dnd.bb-content-selected[data-bb-identifier^="Article/Article"] > div.bb5-ui.bb5-content-actions.content-actions'
                }
            }
        },

        contentset: {
            selector: '[data-bb-identifier^="ContentSet"]:first',
            sections: {
                plugins: {
                    selector : 'div.bb5-ui.bb5-content-actions.content-actions',
                    elements: {
                        plus : {
                            selector: 'a.fa.fa-plus'
                        },
                        large : {
                            selector: 'a.fa.fa-th-large'
                        }
                    }
                }
            },
            elements: {
                contentSelected: {
                    selector: 'div.bb-content.bb-dnd.bb-content-selected[data-bb-identifier^="ContentSet"]'
                },
                contentPlugins: {
                    selector: 'div.bb-content.bb-dnd.bb-content-selected[data-bb-identifier^="ContentSet"] > div.bb5-ui.bb5-content-actions.content-actions'
                }
            }
        }

    }

};
