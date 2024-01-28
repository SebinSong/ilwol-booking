import React, { useState, useEffect } from 'react'
import { Container as MapContainer } from 'react-naver-maps'
import TextLoader from '@components/text-loader/TextLoader'
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'
import HomeNaverMap from './HomeNaverMap.jsx'

const imgPath = '/images/introduction-photo.jpeg'
const videoUrl = 'https://www.youtube-nocookie.com/embed/aGHIsmhuPn8'
const addressString = '성남시 분당구 성남대로 2번길 6 LG트윈하우스'

function HomeIntroduction ({
  classes = '',
  onBackClick = null
}) {
  // local-state
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  // computed state
  const isAssetsLoaded = isImageLoaded && isVideoLoaded

  // method
  const preloadImage = () => {
    const el = new Image()
    el.onload = () => { setIsImageLoaded(true) }
    el.src = imgPath
  }
  const backClickHandler = () => {
    onBackClick && onBackClick()
  }

  // effects
  useEffect(() => {
    preloadImage()
  }, [])

  return (
    <div className={`content-introduction ${classes}`}>
      <iframe id='ghost-iframe' src={videoUrl} onLoad={() => setIsVideoLoaded(true)}></iframe>
      {
        !isAssetsLoaded
          ? <TextLoader>로딩중..</TextLoader>
          : <>
              <div className='intro-details'>
                <div className='intro-header mb-70'>
                  <h3 className='home-section-title'>
                    <span className='icon-info-circle is-prefix'></span>
                    <span className='text'>선녀님 소개</span>
                  </h3>

                  <button type='button' className='is-secondary is-small'
                    onClick={backClickHandler}>
                    <span className='icon-chevron-left-circle is-prefix'></span>
                    <span>뒤로가기</span>
                  </button>
                </div>

                <div className='intro-img-container mb-70'>
                  <div className='img-wrapper'>
                    <img src={imgPath} alt='Introduction image' />
                  </div>

                  <div className='img-bg-effect'>
                    <div className='box is-1'></div>
                    <div className='box is-2'></div>
                  </div>
                </div>

                <ul className='intro-list mb-50'>
                  <li className='intro-list-item'>
                    단국대(서울 힌남동) 영문과 학사 출신이시며, <span className='has-text-bold'>20년</span> 가까이 신점 전문가로 활동 중이십니다.
                  </li>
                  <li className='intro-list-item'><span className='has-text-bold'>심리상담사 자격증</span>과 <span className='has-text-bold'>한부모지도사 자격증</span>을 보유하고 계십니다.</li>
                  <li className='intro-list-item'><span className='has-text-bold'>미래</span>에 있을 사실을 잘 맞추시며 (아래 <span className='has-text-bold'>jtbc 뉴스</span> 참고), 상담자의 <span className='has-text-bold'>숨겨진 능력 개발</span>에 대한 정확한 조언으로 유명하십니다.</li>
                  <li className='intro-list-item'><span className='has-text-bold'>사주, 인간, 인생의 진실 / 진리</span>에 입각하여 애정을 담아 카운셀링하십니다.</li>
                  <li className='intro-list-item'>현재 <span className='has-text-bold'>유튜브</span> 채널&nbsp;
                    <a className='y-link has-text-bold text-color-magenta' href='https://www.youtube.com/@ilwolsung' target='_blank'><i className='icon-web-link'></i>일월선녀 해달별</a>
                    을 운영하고 계십니다.
                  </li>
                </ul>

                <h3 className='home-section-title mb-10'>
                <span className='icon-info-circle is-prefix'></span>
                  <span className='text'>jtbc 뉴스 출연</span>
                </h3>

                <p className='intro-paragraph mb-20'>2022년 월드컵 조별 리그 결과 족집게 예측으로, <span className='has-text-bold'>jtbc 뉴스반장</span>에 소개가 되었습니다.</p>

                <div className='youtube-player-container mb-50'>
                  <iframe width='100%' height='100%'
                    title='Youtube video player'
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    src={videoUrl}
                    allowFullScreen>
                  </iframe>
                </div>

                <h3 className='home-section-title mb-10'>
                  <span className='icon-info-circle is-prefix'></span>
                  <span className='text'>오시는 길</span>
                </h3>

                <p className='intro-paragraph mb-30'><span className='has-text-bold'>오리역 3번출구</span>에서 직진하여 도보로 <span className='has-text-bold'>5분거리</span>에 있습니다. (주차 가능)</p>

                <p className='address mb-10'>
                  <span className='address-label'>주소 :</span>
                  <span className='address-content'>
                    <span className='address-str'>{addressString}</span>
                    <CopyToClipboard classes='ml-4'
                      onlyButton={true}
                      textToCopy={addressString}
                      toastOpt={{
                        heading: '주소 복사',
                        content: '클립보드에 저장 되었습니다.'
                      }}></CopyToClipboard>
                  </span>
                </p>

                <div className='map-wrapper'>
                  <HomeNaverMap />
                </div>
              </div>
            </>
      }
    </div>
  )
}

export default React.memo(HomeIntroduction)