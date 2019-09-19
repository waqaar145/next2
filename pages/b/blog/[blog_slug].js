import { useRouter } from 'next/router';
import axios from 'axios';
import https from 'https';
import moment from 'moment'
import Layout from './../../../components/layout';
import { NextSeo } from 'next-seo';
import ReactHtmlParser from 'html-react-parser';
import striptags from 'striptags';
import {
  FacebookShareButton,
  TwitterShareButton
} from 'react-share';
import Router from 'next/router'

const SingleBlog = ({result, origin}) => {

  if (result === 'error') {
    return (
      <Layout>
        <h4>Blog not found.</h4>
      </Layout>
    )
  }
  let blog = result.data;

  let content = striptags(blog.content)


  return (
    <Layout>
      <NextSeo
        openGraph={{
          type: 'website',
          url: `${origin}/b/blog/${blog.slug}`,
          title: blog.title,
          description: content,
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
        {/* <FacebookShareButton url={`${origin}/b/blog/${blog.slug}`}>yyyyyyyy</FacebookShareButton> */}
        <h3>{blog.title}</h3>
        <h3>{blog.author}</h3>
        <h3>Posted at - {moment(blog.created_at).format('MMMM Do YYYY')}</h3>
        {ReactHtmlParser(blog.content)}
        <img src={blog.logo} />
      </div>
    </Layout>
  )
}

SingleBlog.getInitialProps = async ({query, req, res, origin}) => {
  const agent = new https.Agent({
    rejectUnauthorized: false
  })
  try {
    let data = {
      slug: query.slug
    }
    console.log('data - ', data)
    let result = await axios.post('https://staging.nhancego.com/api/blog/retrieve_blog_slug/', data, { httpsAgent: agent });
    console.log('result - ', req.headers.host)
    return { result: result.data, origin: req.headers.host }
  } catch (err) {
    return {result: 'error'}
  }
}

export default SingleBlog;
