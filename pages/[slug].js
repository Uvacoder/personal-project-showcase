import { Button, Box, Container, Heading, Text } from 'theme-ui'
import React, { useState } from 'react'
import Meta from '../components/meta'
import Emoji from '../components/emoji'
import ReactPlayer from 'react-player/youtube'
import { useRouter } from 'next/router'

function App(props) {
  const [video, toggleVideo] = useState('0')
  const router = useRouter()
  return (
    <Box p={0} sx={{ width: '100%' }} m={0}>
      <Meta />

      <Box
        sx={{
          background: `linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.94),
      rgba(0, 0, 0, 0.74)
    ),url(https://i.ytimg.com/vi/${props.data['fields']['Youtube ID']}/maxresdefault.jpg)`,
          backgroundSize: 'cover',
          color: 'white',
          fontSize: '1.3rem!important',
          width: '100%',
          backgroundPosition: 'center',
          height: '100vh',
          display: video != '1' ? 'default' : 'none',
        }}
      >
        <Container py={4} pt={6}>
          <Box
            ml="0px"
            mb="4px"
            sx={{
              width: 'max-content',
              verticalAlign: 'middle',
              borderRadius: '8px',
              fontSize: '36px',
            }}
          >
            <Text
              sx={{
                bg: 'white',
                color: 'black',
                borderRadius: '8px',
                fontSize: '0.5em',
                p: '4px',
                pb: '5px',
                verticalAlign: '8px',
                pl: '6px',
                pr: '6px',
                mr: '8px',
              }}
              onClick={() => router.back()}
            >
              {'❮ Back'}
            </Text>
            <Emoji emoji={props.data['fields']['3 Emoji Desc']} />
          </Box>
          <Heading
            sx={{
              fontSize: ['2.3rem', '4rem', '4rem'],
              marginBottom: '16px',
              maxWidth: '600px',
            }}
          >
            {props.data['fields']['Project Name']}
          </Heading>
          <Text
            sx={{
              fontSize: '1.3rem!important',
              fontWeight: '600',
              marginTop: '0px',
              paddingTop: '0px',
              lineHeight: '1.8',
            }}
          >
            {' '}
            Created by: {props.data['fields']['Student Name']}
            <br />
            Global Context: {props.data['fields']['Global Context']}
            <br />
            <Button
              mt="12px"
              onClick={() => toggleVideo('1')}
              sx={{ lineHeight: '1.3' }}
            >
              {video != '0.1' ? 'Play Demo' : 'Resume Demo'}
            </Button>
          </Text>
        </Container>
      </Box>

      <Box
        onClick={() => toggleVideo('0.1')}
        sx={{ display: video != '1' ? 'none' : 'default' }}
      >
        <ReactPlayer
          width="100vw"
          height="100vh"
          playing={video == '1' ? true : false}
          style={{ pointerEvents: 'none' }}
          url={`https://www.youtube.com/watch?v=${props.data['fields']['Youtube ID']}`}
          onClick={() => toggleVideo(false)}
          onEnded={() => toggleVideo('0')}
          config={{
            youtube: {
              playerVars: {
                showinfo: 0,
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
              },
            },
          }}
        />
      </Box>
    </Box>
  )
}

export async function getStaticPaths() {
  var GithubSlugger = require('github-slugger')
  const AirtablePlus = require('airtable-plus')

  const airtable = new AirtablePlus({
    baseID: process.env.AIRTABLE_BASE,
    apiKey: process.env.AIRTABLE_TOKEN,
    tableName: 'Students',
  })
  var slugger = new GithubSlugger()
  const paths = (await airtable.read({})).map(data => ({
    params: {
      slug: slugger.slug(data.fields['Student Name']),
      id: data.id,
    },
  }))
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  var lodash = require('lodash')
  var GithubSlugger = require('github-slugger')
  const AirtablePlus = require('airtable-plus')

  const airtable = new AirtablePlus({
    baseID: process.env.AIRTABLE_BASE,
    apiKey: process.env.AIRTABLE_TOKEN,
    tableName: 'Students',
  })

  var slugger = new GithubSlugger()
  const path = lodash.filter(
    (await airtable.read({})).map(data => ({
      params: {
        slug: slugger.slug(data.fields['Student Name']),
        id: data.id,
      },
    })),
    path => path.params.slug === params.slug,
  )[0]
  const res = await airtable.find(path.params.id)
  console.log(res)
  return {
    props: {
      data: res,
    },
  }
}

export default App
