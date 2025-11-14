import React, { useEffect } from 'react';

export default function TeamWidget({ teamId, season = 2023, type = 'statistics', theme = 'white' }) {
    useEffect(() => {
        if (!document.querySelector('script[src="https://widgets.api-sports.io/3.1.0/widgets.js"]')) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://widgets.api-sports.io/3.1.0/widgets.js';
            document.body.appendChild(script);
        }
    }, []);

    const config = `
    <api-sports-widget
      data-type="config"
      data-key="1b4a2ac95b6319ca743e3be72f8948d8"
      data-sport="football"
      data-theme="${theme}"
      data-lang="en"
      data-show-errors="true"
      data-show-logos="true"
    ></api-sports-widget>
  `;

    const widgetMap = {
        statistics: `<api-sports-widget data-type="team" data-team-id="${teamId}" data-season="${season}" data-team-statistics="true"></api-sports-widget>`,
        squads: `<api-sports-widget data-type="team" data-team-id="${teamId}" data-season="${season}" data-team-squad="true"></api-sports-widget>`,
        venue: `<api-sports-widget data-type="team" data-team-id="${teamId}" data-season="${season}" data-team-venue="true"></api-sports-widget>`
    };

    return (
        <div
            dangerouslySetInnerHTML={{
                __html: config + widgetMap[type]
            }}
        />
    );
}
