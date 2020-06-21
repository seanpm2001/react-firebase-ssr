import React, {Fragment, useMemo} from "react";
import {Helmet} from 'react-helmet';
import Time from "@components/Time";
import dayjs from "dayjs";
import banner from '../../banner.jpg';

const Event = () => {

    const event = useMemo(() => ({
        name: "React + SSR + Firebase = ♥️",
        url: "https://react-firebase-ssr.ridermansb.dev/",
        description: "Exemplo usando React SSR rodando na estrutura do firebase cloud functions",
        image: banner,
        startDate: dayjs(new Date(2020, 5, 23, 18, 0, 0)),
        endDate: dayjs(new Date(2020, 5, 23, 19, 0, 0)),
        location: 'https://youtube.com/',
        performer: 'ridermansb',
        organizer: {
            "name": "e-Core",
            "url": "https://e-core.com/"
        }
    }), []);

    const seo = {
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": event.name,
            "url": event.url,
            "description": event.description,
            "image": `https://react-firebase-ssr.ridermansb.dev${event.image}`,
            "startDate": event.startDate.format('YYYY-MM-DDTHH:mm-03:00'),
            "endDate": event.endDate.format('YYYY-MM-DDTHH:mm-03:00'),
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
            "location": {
                "@type": "VirtualLocation",
                "url": event.location
            },
            "performer": {
                "@type": "Person",
                ...event.performer
            },
            "organizer": {
                "@type": "Organization",
                ...event.organizer
            }
        }
    }

    return (
        <div className="uk-padding-bottom uk-margin-bottom">
            <Helmet encodeSpecialCharacters={false}>
                <title itemProp="name">{seo.structuredData.name}</title>
                <script type="application/ld+json">{JSON.stringify(seo.structuredData)}</script>
                <meta name="author" content={seo.structuredData.performer.name}/>

                <meta name="image" property="og:image" content={seo.structuredData.image}/>
                <meta property="og:image" content={seo.structuredData.image}/>
                <meta property="og:image:secure" content={seo.structuredData.image}/>
                <meta property="og:image:width" content="1080"/>
                <meta property="og:image:height" content="1080"/>
                <meta property="og:image:type" content="image/jpeg"/>
                <meta property="og:image:alt" content={seo.structuredData.name}/>

                <meta property="og:title" content={seo.structuredData.name}/>
                <meta property="og:site_name" content={seo.structuredData.name}/>
                <meta property="og:url" content={seo.structuredData.url}/>
                <meta property="og:description" content={seo.structuredData.description}/>
                <meta property="og:type" content="website"/>
                <meta property="og:locale" content="pt_BR"/>

                <meta property="fb:app_id" content={process.env.FACEBOOK_APP_ID}/>
                <meta property="fb:app:id" content={process.env.FACEBOOK_APP_ID}/>

                <meta name="twitter:card" content="summary"/>
                <meta name="twitter:site" content={`@${seo.structuredData.name}`}/>
                <meta name="twitter:title" content={seo.structuredData.name}/>
                <meta name="twitter:description" content={seo.structuredData.description}/>
                <meta name="twitter:image" content={seo.structuredData.image}/>
                <meta name="twitter:image:src" content={seo.structuredData.image}/>
                <meta property="twitter:domain" content="react-firebase-ssr.ridermansb.dev"/>
                <meta name="twitter:image:alt" content={seo.structuredData.name}/>
                <meta name="twitter:creator" content={seo.structuredData.performer.name}/>
            </Helmet>

            <div className="uk-container">
                <h3 className="uk-heading-bullet uk-text-muted uk-margin-top">react-firebase-ssr</h3>
                <Time/>

                <div className="uk-card uk-card-default">
                    <div className="uk-card-media-top">
                        <img src={seo.structuredData.image} alt={seo.structuredData.name}/>
                    </div>
                    <div className="uk-card-body">
                        <h3 className="uk-card-title">{seo.structuredData.name}</h3>
                        <p>{seo.structuredData.description}</p>
                    </div>
                </div>

                <div className="uk-card uk-card-default uk-card-body uk-margin-small-top">
                    <dl className="uk-description-list">
                        <dt className="uk-text-bold">Quando?</dt>
                        <dd>{event.startDate.calendar()} - {event.endDate.format('LT')}</dd>
                    </dl>
                    <dl className="uk-description-list">
                        <dt className="uk-text-bold">Onde?</dt>
                        <dd>{event.location}</dd>
                    </dl>
                    <dl className="uk-description-list">
                        <dt className="uk-text-bold">Quem?</dt>
                        <dd>
                            {event.performer} / <a href={event.performer.url} target="_blank">{event.organizer.name}</a>
                        </dd>
                    </dl>
                </div>

            </div>
        </div>
    )
}

export default Event;