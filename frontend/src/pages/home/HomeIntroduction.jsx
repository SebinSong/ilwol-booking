import React, { useState, useEffect } from 'react'
import TextLoader from '@components/text-loader/TextLoader'

const imgPath = '/images/introduction-photo.jpeg'

export default function HomeIntroduction ({
  classes = ''
}) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  // method
  const loadImage = () => {
    const imgEl = new Image()
    imgEl.onload = () => { setIsImageLoaded(true) }

    imgEl.src = imgPath
  }

  // effects
  useEffect(() => {
    loadImage()
  }, [])

  return (
    <div className={`content-introduction ${classes}`}>
      {
        !isImageLoaded
          ? <TextLoader>로딩중..</TextLoader>
          : <>
              <div className='home-flex-container'>
                <div className='intro-img-container'>
                  <div className='img-wrapper'>
                    <img src={imgPath} alt='Introduction image' />
                  </div>

                  <div className='img-bg-effect'>
                    <div className='box is-1'></div>
                    <div className='box is-2'></div>
                  </div>
                </div>

                <div className='intro-details pt-20'>
                  <h3 className='home-section-title mb-30'>
                    <span className='icon-tag is-prefix'></span>
                    <span className='text'>선녀님 소개</span>
                  </h3>

                  <u1 className='intro-list mb-50'>
                    <li className='intro-list-item'>
                      <span className='has-text-bold'>20년차</span> 무당으로, 맑고 고운 영의 소유자 십니다.
                    </li>
                    <li className='intro-list-item'>천신 도사/선녀님을 메인 신령님으로 모시고 계십니다.</li>
                    <li className='intro-list-item'><span className='has-text-bold'>미래 지향적</span> 방향의 상담을 추구하시고, <span className='has-text-bold'>Fact</span>를 잘 맞추십니다.</li>
                    <li className='intro-list-item'>하관/낙서/주역/명리학을 천상에서 공부하신 신의 영매시며, 사심없이 진리에 충실한 제자이십니다.</li>
                  </u1>

                  <h3 className='home-section-title mb-30'>
                    <span className='icon-tag is-prefix'></span>
                    <span className='text'>JTBC 뉴스 소개</span>
                  </h3>
                </div>
              </div>
            </>
      }
    </div>
  )
}
