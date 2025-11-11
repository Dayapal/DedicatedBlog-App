import React from 'react'
import Hero from '../home/Hero'
import Trending from '../home/Trending'

import Creator from '../home/Creator'
import CategoryPage from '../home/CategoryPage'


const Home = () => {
  return (
    <div>
      <Hero />
      <Trending />
       <section className="py-12 border-t border-gray-200">
        <CategoryPage/>
      </section>
      <Creator/>
     
    </div>
  )
}

export default Home
