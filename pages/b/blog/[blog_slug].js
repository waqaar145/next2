import { useRouter } from 'next/router';
import axios from 'axios';
import https from 'https';
import moment from 'moment'
import Layout from './../../../components/layout';
import { NextSeo } from 'next-seo';
import ReactHtmlParser from 'html-react-parser';

const SingleBlog = ({result, origin}) => {

  let router = useRouter();

  console.log(origin)

  if (result === 'error') {
    return (
      <Layout>
        <h4>Event not found.</h4>
      </Layout>
    )
  }
  let blog = result.data;

  return (
    <Layout>
      <NextSeo
        openGraph={{
          type: 'website',
          url: `http://${origin}/b/blog/${blog.id}`,
          title: blog.title,
          description: blog.content,
          images: [
            {
              url: blog.logo,
              width: 800,
              height: 600,
              alt: 'Og Image Alt',
            }
          ],
        }}
      />
      <div className="">
        <h3>{blog.title}</h3>
        <h3>{blog.author}</h3>
        <h3>Posted at - {moment(blog.created_at).format('MMMM Do YYYY')}</h3>
        {ReactHtmlParser(blog.content)}
        <img src={blog.logo} />
      </div>
    </Layout>
  )
}

SingleBlog.getInitialProps = async ({query, req, origin}) => {
  const agent = new https.Agent({
    rejectUnauthorized: false
  })
  try {
    let data = {
      slug: query.blog_slug
    }
    let result = await axios.post('https://staging.nhancego.com/api/blog/retrieve_blog_slug/', data, { httpsAgent: agent });
    return { result: result.data, origin: req.headers.host }
  } catch (err) {
    return {result: 'error'}
  }
}

export default SingleBlog;
