import { useState } from "react";
import {View, Text, StyleSheet, TextInput, Button, ScrollView} from "react-native";
import Search from '../components/NutritionComps/Search'
import NutritionInfo from "../components/NutritionComps/NutritionInfo";
import { AnimatedCircularProgress } from "react-native-circular-progress";


export default function CalorieTracker() {

    const [input, setInput] = useState('');
    const [nutritionData, setNutritionData] = useState(null);

    const fetchData = async () => {
        try {
          const response = await fetch(
            `https://api.api-ninjas.com/v1/nutrition?query=${input}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': '43/k77pdZGlSUxlMxcuAXA==PThyLYxZMDEQMJRd'
              }
            }
          );
          const data = await response.json();
          setNutritionData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    return(
        <ScrollView style={styles.container}>
            <Search 
              setInput={setInput} 
              fetchData={fetchData} 
              placeholder={"Enter Food or Drink"}
              showButton={true}
              buttonName={"Search"}
              buttonColor={'#58a61c'}
            />
            
            {nutritionData && (<NutritionInfo nutrition_info={nutritionData} />)}

            <Text style= {{textAlign:'center', color:'black', fontWeight:'bold'}}>Daily Caloric Intake</Text>

            <View style={styles.calories}>
              <AnimatedCircularProgress
                size={200}
                width={10}
                fill={60}
                tintColor="#58a61c"
                backgroundColor="white"
                style={{padding:10}}>
                {
                  () => (
                    <View style={styles.tracker}>
                      <Text style={styles.trackerTopText}>
                        {'800 cals'}
                      </Text>
                      <Text style={styles.trackerBottomText}>
                        {'Remaining'}
                      </Text>
                    </View>
                  )
                }
                
              </AnimatedCircularProgress>
              <View style={styles.macros}>
                <Text>Total Calories: </Text>
                <Text>Total Protein: </Text>
                <Text>Total Carbohydrates: </Text>
                <Text>Total Fat: </Text>
              </View>
            </View>
            <Button
                title="Remove Item"
                color={'#58a61c'}
            />
            <View style={styles.food}>
                <Text>Food1</Text>
                <Text>Food2</Text>
                <Text>Food3</Text>
                <Text>Food4</Text>
                <Text>Food5</Text>
                <Text>Food6</Text>
                <Text>Food7</Text>
                <Text>Food8</Text>
                <Text>Food9</Text>
                <Text>Food10</Text>
                <Text>Food11</Text>
                <Text>Food12</Text>
            </View>
            
        </ScrollView>
    )

}

const styles = StyleSheet.create({

    calories: {
      flexDirection:"row",
      alignItems:'center',
    },

    trackerTopText:{
      textAlign:'center',
      fontSize:28,
    },

    trackerBottomText:{
      textAlign:'center',
      fontSize:18,
    },

    food:{
        marginLeft:10,
        marginTop:10,
    },

    macros: {
        marginRight:40,
        marginLeft:10,
    },
});