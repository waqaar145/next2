import { useRouter } from 'next/router';
import axios from 'axios';
import https from 'https';
import moment from 'moment'
import Layout from './../../../components/layout'
import { NextSeo } from 'next-seo';

const SingleEvent = ({result, origin}) => {

  if (result === 'error') {
    return (
      <Layout>
        <h4>Event not found.</h4>
      </Layout>
    )
  }
  let event = result.data.paid_event_data;

  console.log(`${origin}/b/event/${event.slug}`)
  return (
    <Layout>
      <NextSeo
        openGraph={{
          type: 'website',
          url: `${origin}/b/event/${event.slug}`,
          title: event.event_name,
          description: event.description,
          images: [
            {
              url: event.event_card_image,
              width: 800,
              height: 600,
              alt: 'Og Image Alt',
            }
          ],
        }}
      />
      <div className="">
        <p>{event.category.category_name}</p>
        <h3>{event.event_name}</h3>
        <p>{event.artist_name}, {event.genres}</p>
        {
          event.timestamps.map(time => {
            return (
              <div key={time.id}>
                Duration - {moment(time.start_date).format('MMMM Do YYYY')} - {moment(time.end_date).format('MMMM Do YYYY')}, {time.start_time} - {time.end_time}
              </div>
            )
          })
        }
        <hr />
        {event.event_type}
        <hr />
        <h2>About the event</h2>
        <p>{event.description}</p>
        <br />
      </div>
    </Layout>
  )
}

SingleEvent.getInitialProps = async ({query, req, res}) => {
  const agent = new https.Agent({
    rejectUnauthorized: false
  })
  try {
    let data = {
      slug: query.event_slug
    }
    console.log(data)
    let result = await axios.post('https://staging.nhancego.com/api/paid_events/retrieve_slug/', data, { httpsAgent: agent });
    return { result: result.data, origin: req.headers.host }
  } catch (err) {
    return {result: 'error'}
  }
}

export default SingleEvent;
