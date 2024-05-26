import { useState } from 'react'
import './App.css'
import movies from './data/movies.json'
import { formatDuration } from './libs/utils'

export default function App() {
  console.log(movies)

  return (
    <>
      <div className="row">
        <div className="row-header">
          <div className="row-header__title">My List</div>
          <div className="row-header__more">Explore All</div>
        </div>
        <div className="row-container">
          {movies.data.map(movie => {
            return (
              <div className="row-item" key={movie.videoId}>
                <div className="row-item__container">
                  <img className="row-item__boxart" src={movie.boxart.url} />
                  <p className="">{formatDuration(movie.runtimeSec ?? 0)}</p>
                  <div className="fallback__container">
                    <p className="fallback__text">{movie.title}</p>
                  </div>
                </div>
              </div>

            )
          })}
        </div>
      </div>
    </>
  )
}
