import React, { useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  Button,
  Animated,
  useWindowDimensions,
  Alert
} from 'react-native';
import CustomButton from '../CustomButtons';
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from 'react';
import { day } from '../../jsFiles/ProgObjs';
import { EditModal } from './EditModal';
import { CopyModal } from './CopyModal';
import LinearGradient from 'react-native-linear-gradient';
import { supabase } from '../../lib/supabase';



//allow for copying, from 1, to many, will probably need a map, modal comes up
//finalise will check if weeks are empty and alert if is empty
//modal for editing, day modal probably

export function EditProg({ prog, setProg }) {
  const [editVisible, setEditVisible] = useState(false)
  const [copyVisible, setCopyVisible] = useState(false)
  const [indexs, setIndexs] = useState([0, 0])
  const [postedProgramme, setPostedProgramme] = useState([]);
  const [postedWeeks, setPostedWeeks] = useState([]);
  const navigation = useNavigation()

  useEffect(() => {
    addWeeks();
  }, [])

  const scrollX = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();

  //slide index for week
  let curWeek;
  var currentUserId = 'd9fd43fd-39ce-4683-9cf5-d27ececcc2b5'

  const removeDayFromWeek = (weekIndex, dayIndex) => {
    const updatedWeeks = [...prog.weeks];
    updatedWeeks[weekIndex].days.splice(dayIndex, 1);
    setProg({ ...prog, weeks: updatedWeeks });
  };

  const addDayToWeek = (weekIndex) => {
    const updatedWeeks = [...prog.weeks];
    let num = updatedWeeks[weekIndex].days.length
    updatedWeeks[weekIndex].days[num] = new day(num, "day " + (num + 1));
    setProg({ ...prog, weeks: updatedWeeks });
    // console.log(prog);
  }

  const addExerciseToDay = (weekIndex, dayIndex, exercise) => {
    const updatedWeeks = [...prog.weeks];
    updatedWeeks[weekIndex].days[dayIndex].exercises.push(exercise);
    setProg({ ...prog, weeks: updatedWeeks });
  };

  // Function to remove an exercise from a specific day
  const removeExerciseFromDay = (weekIndex, dayIndex, exerciseIndex) => {
    const updatedWeeks = [...prog.weeks];
    updatedWeeks[weekIndex].days[dayIndex].exercises.splice(exerciseIndex, 1);
    setProg({ ...prog, weeks: updatedWeeks });
  };

  const handleEditModal = (wIndex, dIndex) => {
    setIndexs([parseInt(wIndex), parseInt(dIndex)])
    console.log(indexs)
    setEditVisible(!editVisible)
  }

  const handleCopyModal = () => {
    setCopyVisible(!copyVisible)
  }

  const finalProtocol = () => {
    for (let i=0; i<prog.weeks.length; i++){
      if (prog.weeks[i].days.length === 0){
        Alert.alert('Programme incomplete','Please fill out each week before finalizing.');
        return;
      }

      for (let j=0; j< prog.weeks[i].days.length; j++){
        if (prog.weeks[i].days[j].exercises.length === 0){
          Alert.alert('Programme incomplete','Please fill out or remove days before finalizing.');
          return;
        }
      }
    }
    Alert.alert('Finalizing','Are you happy with your programme?', 
    [{text:'Yes', onPress:()=>{
      addProgramme();
      navigation.navigate("Home");
    }},
    {text:'No', onPress:()=>{return}}])
    }

  // async function getLatestProgramme() {
  //   const {data, error} = await supabase.rpc('get_latest_fitness_programme', {userid: 'd9fd43fd-39ce-4683-9cf5-d27ececcc2b5'})
  //   console.log(error);
  //   setPostedProgramme(data);
  //   // console.log("Last programme made", data);
  // }

  // const addProgramme = async () => {

  async function addWeeks({ programme_id, weeks }) {
    var week_num = prog.weeks.length;

    for (let i = 0; i < week_num; i++) {
      // console.log("week increment", prog.weeks[0].id + i);
      const { data, error } = await supabase
        .from('fitness_week')
        .insert([
          { programme_id: programme_id, week_number: prog.weeks[0].id + 1 + i }
        ])
        .select()

      // console.log("week data", data);
      addDays({week_id: data[0].id, week: weeks[i]});
    }

  }

  async function addDays({week_id, week}) {
    var day_num = week.days.length;

    for (let j = 0; j < day_num; j++) {

      var num_of_exercises = week.days[j].exercises.length;
      var day_name = week.days[j].name;
      const { data, error } = await supabase
      .from('fitness_day')
      .insert([
        { week_id: week_id, num_of_exercises: num_of_exercises, day_name: day_name }
      ])
      .select()
      
      // console.log("Day data", data);
      // console.log("week in days", week);
      addExercises( {day_id: data[0].id, day: week.days[j]} );
    }


  }

  async function addExercises({day_id, day}) {
    var exercise_num = day.exercises.length;

    for (let k = 0; k < exercise_num; k++) {

      var exercise_name = day.exercises[k].name;
      var exercise_sets = day.exercises[k].sets;
      var exercise_reps = day.exercises[k].reps;

      const { data, error } = await supabase
      .from('exercises')
      .insert([
        { name: exercise_name, reps: exercise_reps, sets: exercise_sets, day_id: day_id}
      ])
      .select()

      // console.log("Exercise data", data);
    }

  }

  async function addProgramme() {
    const { data, error } = await supabase
      .from('fitness_programmes')
      .insert([
        { name: prog.name, made_by: currentUserId, weeks: prog.weeks.length }
      ])
      .select()

    // getLatestProgramme();
    var week_num = prog.weeks.length;

    setTimeout(() => { console.log('1 second passed'); }, 1000);
    // for (let i = 0; i < week_num; i++) {

    // const {week_data, error1} = await supabase
    // .from('fitness_week')
    // .insert([
    //   {programme_id: data[0].id, week_number: prog.weeks[0].id + 1}
    // ])
    // .select()

    // console.log("week data", week_data);
    // setPostedWeeks(week_data);
    // console.log("week", postedWeeks);
    addWeeks({ programme_id: data[0].id, weeks: prog.weeks });

    // }

  }

  console.log("prog", prog);

  return (
    <SafeAreaView style={{ ...styles.container, marginVertical: 50 }}>


      <View style={styles.scrollContainer}>
        <ScrollView
          horizontal={true}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={1}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ], { useNativeDriver: false })}>

          {prog.weeks.map((week, weekIndex) => {
            return (

              <View key={weekIndex} style={{ width: windowWidth, height: 620, }} key={weekIndex}>
                <View style={styles.progContainer}>


                  <View style={{ ...styles.textContainer }}>
                    <LinearGradient
                      colors={['blue', 'navy']}>
                      <Text style={{ ...styles.text, color: "white", fontSize:20,}}>  {prog.name}</Text>
                      <Text style={{ ...styles.text, color: "white", fontSize:20 }}>  Duration:{prog.duration} weeks</Text>

                      <Text style={{ ...styles.text, color: "white", alignSelf: "center", margin: 10 }}> Week {(weekIndex + 1)}</Text>
                    </LinearGradient>
                  </View>



                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    style={epStyles.days}>
                    {week.days.map((day, dayIndex) => {
                      return (

                        <View key={weekIndex+ " / " +dayIndex}style={epStyles.day}>

                          <Text>{day.name}</Text>
                          {day.exercises.map((exer, exerIndex) => {
                            return (
                              <View style={epStyles.dayInfo}>
                                <Text style={{textAlign:'right'}}>{exer.name}</Text>
                                <Text>{"Sets:" + exer.sets}</Text>
                                <Text>{"Reps:" + exer.reps}</Text>
                              </View>
                            )
                          })
                          }


                          <View style={epStyles.buttonGroup}>

                            <CustomButton
                              onPress={() => { handleEditModal(weekIndex, dayIndex) }}
                              text={"Edit day"}
                              width={70}
                              height={40}
                              color={"navy"} />

                            <View style={{ marginHorizontal: 10 }} />

                            <CustomButton
                              onPress={() => { removeDayFromWeek(weekIndex, dayIndex) }}
                              text={"-remove"}
                              width={70}
                              height={40}
                              color={"navy"} />

                          </View>
                        </View>
                      )
                    })}
                  </ScrollView>

                </View>
              </View>
            )
          })}
        </ScrollView>
      </View>



      <View style={epStyles.buttonGroup}>

        <CustomButton
          onPress={() => {
            curWeek = Math.round(Animated.divide(scrollX, windowWidth).__getValue())
            if (prog.weeks[curWeek].days.length < 7) {
              addDayToWeek(curWeek)
            }
          }}
          text={"+ add day"}
          width={100}
          height={50}
          color={"navy"} />

        <View style={{ marginHorizontal: 10 }} />

        <CustomButton
          onPress={() => handleCopyModal()}
          text={"copy weeks"}
          width={100}
          height={50}
          color={"navy"} />
        <View style={{ marginHorizontal: 10 }} />
        {/* console.log(...prog); */}
        <CustomButton
          onPress={() => finalProtocol()}
          text={"✔ finalize"}
          width={100}
          height={50}
          color={"navy"} />
      </View>




      <CopyModal
        visible={copyVisible}
        handleModal={handleCopyModal}
        prog={prog}
        setProg={setProg}
        addDay={addDayToWeek}
        addEx={addExerciseToDay}
      />

      <EditModal
        visible={editVisible}
        handleModal={handleEditModal}
        prog={prog}
        setProg={setProg}
        indexs={indexs}
        addEx={addExerciseToDay}
        remEx={removeExerciseFromDay}
      />

    </SafeAreaView>

  )
}


const epStyles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    margin: 20,
    backgroundColor: "navy"
  },
  days: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  day: {
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
    borderColor: "navy",
    backgroundColor: "white",
    width: 320,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 10,
  },
  dayInfo: {
    flexDirection: "row",
    justifyContent: 'space-evenly'
  }
})





const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    height: 620,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 550,
    marginBottom: 15

  },
  progContainer: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: 'scroll',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: "white",

  },
  textContainer: {
    height: 100,
    width: 400,
    backgroundColor: "navy",

  },
  text: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    paddingHorizontal: 30,
    paddingTop: 5,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'purple',
    marginHorizontal: 4,
    margin: 4

  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
