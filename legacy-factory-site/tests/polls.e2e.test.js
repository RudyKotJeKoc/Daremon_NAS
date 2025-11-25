import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { initPollsPage } from '../polls-page.js';

describe('polls page integration', () => {
    let dom;

    beforeEach(() => {
        dom = new JSDOM(`<!DOCTYPE html><html><body>
            <main id="polls-main">
                <section>
                    <div id="polls-container"></div>
                </section>
            </main>
        </body></html>`, { url: 'https://daremon.example/polls.html' });

        global.window = dom.window;
        global.document = dom.window.document;
        global.localStorage = dom.window.localStorage;
    });

    afterEach(() => {
        dom.window.close();
        delete global.window;
        delete global.document;
        delete global.localStorage;
    });

    it('renderuje ankiety bez wymaganego głównego playera', () => {
        const pollSystem = initPollsPage(dom.window.document);
        const renderedPolls = dom.window.document.querySelectorAll('.poll-card');

        expect(pollSystem).not.toBeNull();
        expect(renderedPolls.length).toBeGreaterThan(0);
        expect(dom.window.document.getElementById('player-ui')).toBeNull();
    });
});
