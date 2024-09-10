import { View, Text, SafeAreaView, ImageBackground, Image, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { screenDimensions } from '../../constants/screenDimensions'
import { COLOURS } from '../../theme/theme'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, { interpolate, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated'
import { baseImagePath } from '../../api/MovieAPICall'
import { LinearGradient } from 'expo-linear-gradient'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { supabase } from '../../Embeddings/supabase'
import AuthContext from '../../contexts/AuthContext'
import { useIsFocused } from '@react-navigation/native'

// I need title, overview and poster path

// const { data, error } = await supabase.functions.invoke('embed_for_users', {
//   body: { inputs: ["Hello, World!", "You are awesome!", "OMG"] },
// })

const MovieRecommendationScreen = (props) => {

  const isFocused = useIsFocused()

  const [listOfRecommendedMovies, setListOfRecommendedMovies] = useState<any>([
    {
      "adult": false,
      "backdrop_path": "/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg",
      "genre_ids": [
        12,
        28,
        878
      ],
      "id": 299536,
      "original_language": "en",
      "original_title": "Avengers: Infinity War",
      "overview": "As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos. A despot of intergalactic infamy, his goal is to collect all six Infinity Stones, artifacts of unimaginable power, and use them to inflict his twisted will on all of reality. Everything the Avengers have fought for has led up to this moment - the fate of Earth and existence itself has never been more uncertain.",
      "popularity": 352.831,
      "poster_path": "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
      "release_date": "2018-04-25",
      "title": "Avengers: Infinity War",
      "video": false,
      "vote_average": 8.246,
      "vote_count": 29319
    },
    {
      "adult": false,
      "backdrop_path": "/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg",
      "genre_ids": [
        878,
        28,
        12
      ],
      "id": 24428,
      "original_language": "en",
      "original_title": "The Avengers",
      "overview": "When an unexpected enemy emerges and threatens global safety and security, Nick Fury, director of the international peacekeeping agency known as S.H.I.E.L.D., finds himself in need of a team to pull the world back from the brink of disaster. Spanning the globe, a daring recruitment effort begins!",
      "popularity": 211.869,
      "poster_path": "/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
      "release_date": "2012-04-25",
      "title": "The Avengers",
      "video": false,
      "vote_average": 7.717,
      "vote_count": 30403
    },
    {
      "adult": false,
      "backdrop_path": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
      "genre_ids": [
        12,
        878,
        28
      ],
      "id": 299534,
      "original_language": "en",
      "original_title": "Avengers: Endgame",
      "overview": "After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all, no matter what consequences may be in store.",
      "popularity": 226.753,
      "poster_path": "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      "release_date": "2019-04-24",
      "title": "Avengers: Endgame",
      "video": false,
      "vote_average": 8.252,
      "vote_count": 25274
    },
  ])

  const { user, setUser } = useContext(AuthContext)

  const [likedMoviesData, setLikedMoviesData] = useState<any>([])
  const [dislikedMoviesData, setDislikedMoviesData] = useState<any>([])

  const [userAvgEmbedding, setUserAvgEmbedding] = useState<any>([0.012749170884490013, 0.00012651945871766657, 0.036824192851781845, -0.045637451112270355, 0.04537162557244301, 0.09250867366790771, 0.07850374281406403, 0.0077324919402599335, 0.004960375372320414, -0.06532996892929077, 0.0539616197347641, -0.0056418501771986485, 0.03508772328495979, 0.005207656882703304, 0.010334186255931854, 0.01664760708808899, -0.015145383775234222, 0.04058968275785446, -0.046909358352422714, 0.06881427019834518, -0.006022538058459759, -0.029807841405272484, 0.014030681923031807, -0.060683805495500565, 0.048650942742824554, 0.04126963019371033, -0.026935631409287453, 0.007176361512392759, -0.06110057234764099, -0.12493778020143509, 0.019311966374516487, -0.06617069989442825, 0.07862424850463867, -0.06271994113922119, 0.0027276913169771433, -0.07808305323123932, -0.03415483236312866, 0.05575850233435631, -0.007856082171201706, 0.017238134518265724, 0.027860311791300774, 0.0008916731458157301, 0.006805735174566507, -0.09510646015405655, -0.06444180011749268, -0.055370986461639404, 0.010132765397429466, -0.03284000605344772, 0.05416977033019066, -0.04573874548077583, 0.058585815131664276, -0.04875195026397705, 0.012227489612996578, 0.01820048876106739, -0.030598698183894157, 0.0004029085976071656, 0.04907512292265892, 0.008118136785924435, 0.06452598422765732, 0.06140459328889847, 0.04353397339582443, -0.006287608295679092, -0.16295970976352692, 0.049374114722013474, 0.046272605657577515, 0.035115551203489304, -0.06879711896181107, -0.036905042827129364, 0.016909709200263023, 0.02294089086353779, -0.04538319632411003, 0.04245903342962265, 0.05228174477815628, 0.051528580486774445, -0.015092911198735237, 0.00937082152813673, -0.011797665618360043, -0.06979973614215851, -0.02712753601372242, -0.012671160511672497, 0.027049893513321877, -0.03387431800365448, -0.03437269106507301, -0.04461196810007095, -0.03153098374605179, -0.046136755496263504, -0.01046313252300024, -0.06796114146709442, -0.017226262018084526, 0.01671501435339451, -0.06540095061063766, 0.007515259087085724, -0.055735401809215546, 0.0008669043309055269, -0.02873157151043415, -0.039036206901073456, 0.04649977758526802, 0.003493307391181588, -0.0004531925660558045, 0.22520047426223755, -0.0003949676756747067, -0.0020773783326148987, 0.03810790926218033, 0.01235109381377697, 0.006880137603729963, -0.0455365851521492, 0.019874069839715958, -0.01142434123903513, 0.009324278682470322, 0.019137920811772346, 0.05386246368288994, -0.05269117280840874, 0.04726054519414902, -0.05747487396001816, 0.04070545360445976, 0.0031345204915851355, 0.04651857167482376, 0.03881221264600754, 0.0024464684538543224, -0.04240395128726959, 0.04900489002466202, 0.006700022146105766, 0.021336503326892853, -0.010250790044665337, 0.08625994622707367, -0.06947185099124908, 0.038616765290498734, 0.15167340636253357, 0.02021014131605625, 0.013788111507892609, 0.06827904284000397, -0.05345139652490616, -0.0003366204909980297, -0.009780166670680046, -0.045180462300777435, 0.004097298718988895, -0.02092251554131508, -0.014482485130429268, 0.006948281079530716, -0.03561790660023689, 0.024214744567871094, -0.14741481840610504, -0.022916700690984726, -0.11220960319042206, -0.03025136888027191, 0.0934530720114708, -0.022745154798030853, 0.04239828139543533, -0.08948178589344025, 0.0927657037973404, -0.007887730374932289, 0.004201576579362154, -0.026249375194311142, -0.002980668330565095, 0.018603306263685226, 0.04478972777724266, -0.007720951922237873, 0.07984499633312225, -0.0398433655500412, 0.022367406636476517, 0.042261723428964615, 0.00401550717651844, -0.017361080273985863, 0.11175168305635452, 0.01886126771569252, -0.031412508338689804, -0.030301757156848907, -0.00847401563078165, 0.00042522975127212703, -0.049869585782289505, -0.02125738561153412, 0.00959881953895092, -0.005020154640078545, 0.0375513918697834, 0.0598476305603981, 0.03925778716802597, -0.01622714102268219, -0.013818132691085339, 0.0007181231630966067, -0.005780820734798908, 0.012065146118402481, -0.07278700917959213, -0.005960061214864254, 0.02944880537688732, 0.06413311511278152, -0.05017226189374924, 0.038323234766721725, -0.06848455965518951, 0.020911650732159615, 0.056792136281728745, -0.01763167418539524, 0.03172123804688454, 0.0006887246854603291, 0.002625060034915805, -0.0407400019466877, -0.04057789593935013, -0.027846498414874077, -0.03616204112768173, 0.009316422045230865, -0.02003847062587738, 0.03315461054444313, -0.02945612743496895, -0.04990032687783241, 0.027136078104376793, 0.029572736471891403, 0.044090479612350464, 0.05172155052423477, -0.023533567786216736, -0.01606004126369953, 0.030467266216874123, 0.001438260544091463, -0.019750671461224556, 0.015521049499511719, -0.03586193919181824, -0.05118326470255852, -0.007986935786902905, -0.03955356031656265, 0.005596632603555918, 0.0029110305476933718, 0.06694001704454422, 0.06521257758140564, -0.0009895267430692911, -0.0592527762055397, -0.22386275231838226, 0.031508106738328934, -0.01995479129254818, -0.04590589925646782, 0.01349185872823, 0.0037637080531567335, 0.043590255081653595, -0.04335945099592209, 0.056589193642139435, 0.039977047592401505, 0.05023074895143509, 0.003528134198859334, -0.03007940575480461, 0.062327634543180466, -0.012708586640655994, 0.04348653554916382, -0.03156304359436035, 0.026324372738599777, 0.008284961804747581, 0.005658830050379038, -0.06719735264778137, 0.012743519619107246, -0.04581945762038231, -0.07879763841629028, -0.0018529117805883288, 0.0007934083114378154, 0.18829268217086792, 0.09353578090667725, -0.0030433654319494963, -0.05661724507808685, 0.03607216849923134, 0.02256380207836628, -0.042427532374858856, -0.11418380588293076, 0.012323201633989811, 0.032406583428382874, 0.10473316162824631, -0.028648464009165764, -0.04619552940130234, -0.03925948962569237, -0.02885926514863968, 0.034130193293094635, -0.008581914938986301, -0.0698029175400734, -0.001662463298998773, -0.03992554917931557, -0.00719238817691803, 0.05697714909911156, 0.005677690729498863, -0.02014235034584999, 0.029877126216888428, -0.056219786405563354, 0.05703688785433769, 0.010197068564593792, 0.005514401942491531, -0.035993024706840515, -0.07754157483577728, 0.05489938333630562, -0.04287451133131981, 0.048795148730278015, -0.02434578910470009, -0.007404887583106756, 0.043266747146844864, -0.09333294630050659, 0.033101558685302734, 0.03552517667412758, 0.017857631668448448, -0.04070397838950157, 0.06393837183713913, -0.05777354910969734, -0.015418075025081635, 0.07510196417570114, -0.05383127182722092, -0.019746754318475723, 0.042450420558452606, 0.04598059132695198, 0.08138895034790039, -0.06801699846982956, 0.0006588058895431459, 0.045848868787288666, 0.013605599291622639, 0.02695961855351925, -0.030765628442168236, -0.03775427117943764, 0.004288495983928442, -0.023992106318473816, 0.058403875678777695, -0.025487327948212624, 0.00615678820759058, -0.06189419701695442, 0.0008133235387504101, 0.008886132389307022, -0.012894818559288979, -0.032614193856716156, -0.06372492015361786, 0.016370519995689392, -0.3320525288581848, 0.020940065383911133, -0.004673260264098644, 0.03714767098426819, -0.05604963377118111, 0.0051007759757339954, 0.028303204104304314, 0.08480172604322433, -0.04214370623230934, -0.004884000401943922, 0.018237922340631485, 0.004493182525038719, 0.03786393254995346, -0.02983645722270012, 0.032831188291311264, 0.025632048025727272, 0.034239452332258224, -0.07833795994520187, 0.01971196010708809, -0.04500391334295273, 0.012786280363798141, 0.05261523276567459, 0.1701231598854065, -0.0015576531877741218, 0.0467555895447731, 0.020409738644957542, 0.011848554015159607, 0.004327142145484686, 0.04829009249806404, -0.022465404123067856, 0.01899072900414467, 0.041410595178604126, 0.04020663723349571, -0.03727756068110466, 0.02594791352748871, 0.007559973280876875, -0.04282777011394501, 0.018107078969478607, 0.06090612709522247, 0.0103458222001791, -0.039569783955812454, -0.01499316655099392, -0.04500829800963402, -0.024652762338519096, 0.11185043305158615, -0.03121023066341877, 0.029516151174902916, -0.031124508008360863, 0.04890439286828041, -0.010047534480690956, 0.008298639208078384, 0.032037775963544846, -0.021692397072911263, 0.009631793946027756, 0.05217692628502846, 0.016739970073103905, -0.07858879864215851, -0.0272651556879282, 0.006079094018787146, -0.00422958517447114, 0.029483947902917862, -0.03335248678922653, -0.039826400578022, -0.009302511811256409, 0.02192813903093338])

  const [currCardindex, setCurrCardIndex] = useState(0)
  const [nextCardIndex, setNextCardIndex] = useState(1)

  const hiddenTranslateX = screenDimensions.screenWidth * 2
  const VELOCITY_LIMIT = 900

  const translationX = useSharedValue(0);
  const rotateDeg = useDerivedValue(() => interpolate(
    translationX.value,
    [-hiddenTranslateX, 0, hiddenTranslateX],
    [-75, 0, 75]
  ));

  // this function calculates the average embedding for the user
  const getAvgEmbeddingForUser = async () => {
    await Promise.all(likedMoviesData)

    const overviews = likedMoviesData.map(movie => movie.overview);

    const { data, error } = await supabase.functions.invoke('embed_for_users', {
      body: JSON.stringify({ inputs: overviews }),
    })

    if (error) {
      console.error(error)
    }

    return JSON.stringify(data)
  }

  const fetchRecommendedMovies = async () => {
    const { data, error } = await supabase.rpc("match_movies", {
      query_embedding: JSON.stringify(userAvgEmbedding),
      match_threshold: 0.78,
      match_count: 3,
      adult: true,
      original_language: 'en'
    })

    console.log(error)

    setUserAvgEmbedding(JSON.stringify(data))
  }

  // this should get the recommended movies to show the user
  //* TODO
  useEffect(() => {
    
  }, [likedMoviesData])


  function changeCard() {
    translationX.value = 0
    setCurrCardIndex(nextCardIndex)
    if (nextCardIndex + 1 >= listOfRecommendedMovies.length) {
      setNextCardIndex(Infinity)
    } else {
      setNextCardIndex(nextCardIndex + 1)
    }
  }

  useEffect(() => {
    if (currCardindex === Infinity) {
      setCurrCardIndex(0)
      setNextCardIndex(1)
    }
  }, [currCardindex])

  const pan = Gesture.Pan()
    .onChange((event) => {
      translationX.value = withSpring(event.translationX)

    }).onEnd((event) => {
      if (Math.abs(event.velocityX) < VELOCITY_LIMIT) {
        translationX.value = withSpring(0)
        return;
      }

      translationX.value = withSpring(
        hiddenTranslateX * Math.sign(event.velocityX),
        { duration: 30 },
        () => runOnJS(changeCard)()
      )
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { rotate: withSpring(`${rotateDeg.value}deg`) }
    ]
  }))

  const nextCardStyle = useAnimatedStyle(() => ({
    opacity: withSpring(interpolate(
      Math.abs(translationX.value),
      [0, hiddenTranslateX],
      [0.8, 1]
    )),
    transform: [
      {
        scale: withSpring(interpolate(
          Math.abs(translationX.value),
          [0, hiddenTranslateX],
          [0.8, 1]
        ))
      }
    ]
  }))

  const likeAnimation = useAnimatedStyle(() => ({
    opacity: withSpring(interpolate(
      translationX.value,
      [-hiddenTranslateX, 0, screenDimensions.screenWidth],
      [0.5, 0.5, 1]
    )),

    transform: [
      {
        translateX: withSpring(interpolate(
          translationX.value,
          [-hiddenTranslateX, 0, screenDimensions.screenWidth],
          [0.95 * screenDimensions.screenWidth + 30, 0.95 * screenDimensions.screenWidth + 30, 0.3 * screenDimensions.screenWidth + 30]
        ))
      },

      {
        scale: withSpring(interpolate(
          translationX.value,
          [-hiddenTranslateX, 0, screenDimensions.screenWidth],
          [1, 1, 2.0]
        ))
      }
    ]
  }))

  const dislikeAnimation = useAnimatedStyle(() => ({
    opacity: withSpring(interpolate(
      translationX.value,
      [-screenDimensions.screenWidth, 0, hiddenTranslateX],
      [1, 0.4, 0.4]
    )),

    transform: [
      {
        translateX: withSpring(interpolate(
          translationX.value,
          [-screenDimensions.screenWidth, 0, hiddenTranslateX],
          [0.3 * screenDimensions.screenWidth + 30, -0.15 * screenDimensions.screenWidth - 60, -0.15 * screenDimensions.screenWidth - 60]
        ))
      },

      {
        scale: withSpring(interpolate(
          translationX.value,
          [-screenDimensions.screenWidth, 0, hiddenTranslateX],
          [2.0, 1, 1]
        ))
      }
    ]
  }))


  useEffect(() => {
    const fetchLikedMovies = async () => {
      const { data: likedMoviesDataFetched, error } = await supabase
        .from("UsersMovieData")
        .select("liked_movies")
        .eq('userID', user.uid)

      if (error) {
        throw error
      }

      setLikedMoviesData(likedMoviesDataFetched[0].liked_movies)
    }

    const fetchDislikedMovies = async () => {
      const { data: dislikedMoviesDataFetched, error } = await supabase
        .from("UsersMovieData")
        .select("disliked_movies")
        .eq('userID', user.uid)

      if (error) {
        throw error
      }

      setDislikedMoviesData(dislikedMoviesDataFetched[0].disliked_movies)
    }

    fetchLikedMovies();
    fetchDislikedMovies();
  }, [isFocused])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground style={{ flex: 1, alignItems: 'center' }} source={require('../../assets/background.png')}>
        <Text style={styles.header}>Suggest Me</Text>

        <View style={styles.movieCards}>

          <Animated.View style={[styles.dislikeAnimation, dislikeAnimation]}>
            <Fontisto name='dislike' size={40} color={COLOURS.red} />
          </Animated.View>
          {nextCardIndex !== Infinity ? (
            <Animated.View style={[styles.nextMovieCard, nextCardStyle]}>
              <Image source={{ uri: baseImagePath("w500", listOfRecommendedMovies[nextCardIndex].poster_path) }} style={styles.movieCardPoster} />
              <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0, 0.85)', 'rgba(0,0,0,1)']} style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end' }}>
                <Text style={styles.movieTitle}>{listOfRecommendedMovies[nextCardIndex].original_title}</Text>
                <Text style={styles.movieOverview}>{listOfRecommendedMovies[currCardindex].overview}</Text>
              </LinearGradient>
            </Animated.View>
          ) : (
            <View />
          )}
          {
            currCardindex !== Infinity ? (
              <GestureDetector gesture={pan}>
                <Animated.View style={[styles.movieCard, cardStyle]}>
                  <Image source={{ uri: baseImagePath("w500", listOfRecommendedMovies[currCardindex].poster_path) }} style={styles.movieCardPoster} />
                  <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0, 0.85)', 'rgba(0,0,0,1)']} style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end' }}>
                    <Text style={styles.movieTitle}>{listOfRecommendedMovies[currCardindex].original_title}</Text>
                    <Text style={styles.movieOverview}>{listOfRecommendedMovies[currCardindex].overview}</Text>
                  </LinearGradient>
                </Animated.View>
              </GestureDetector>
            ) : (
              <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontFamily: "PoppinsBold" }}>No more movies to recommend! Sorry!</Text>
              </View>
            )
          }

          <Animated.View style={[styles.dislikeAnimation, styles.likeAnimation, likeAnimation]}>
            <Fontisto name='like' size={40} color={COLOURS.green} />
          </Animated.View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )

}

export default MovieRecommendationScreen

const styles = StyleSheet.create({
  header: {
    alignSelf: 'center',
    fontSize: 35,
    fontFamily: 'PoppinsBold',
    color: 'white',
    paddingTop: screenDimensions.StatusBarHeight + 10
  },

  movieCards: {
    height: '60%',
    aspectRatio: 2 / 3,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  movieCard: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: 'black',
    borderColor: COLOURS.secondary,
    borderRadius: 20,
    overflow: 'hidden'
  },

  dislikeAnimation: {
    position: 'absolute',
    aspectRatio: 1,
    width: 70,
    borderRadius: 100,
    backgroundColor: 'transparent',
    borderWidth: 5,
    borderColor: COLOURS.red,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  movieCardPoster: {
    flex: 1
  },

  likeAnimation: {
    borderColor: COLOURS.green,
  },

  nextMovieCard: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    overflow: 'hidden'
  },

  movieTitle: {
    color: 'white',
    margin: 10,
    fontFamily: 'PoppinsBold'
  },

  movieOverview: {
    color: 'white',
    marginLeft: 10,
    marginBottom: 10,
    fontFamily: 'Poppins',
    fontSize: 12
  }
})