import {View, Button, Text, StyleSheet, Pressable, Image, ScrollView, Modal} from "react-native";
import CustomButton from "../../components/CustomButtons";
import { useNavigation } from "@react-navigation/native";
import { fitStyles } from "../../styles/allStyles";
import { useRef } from "react";
import { Animated } from "react-native";
import { ProgDisplayer } from "../../components/fitnessComps/ProgDisplayer";
import { useState } from "react";
import React from "react";



export default function FitnessScreen() {
    //might not need this, will be in the App file with customHeader
    const navigation = useNavigation()
    
    const [visibleModal, setVisibleModal] = useState(false);
    
    

    return(


        <ScrollView 
        showsVerticalScrollIndicator={false}
        style={fitStyles.scrollContainer}
        contentContainerStyle={{justifyContent:"space-evenly"}}
        overScrollMode="never"
        bounces={true}>

    
            
            <View 
            style={{...fitStyles.viewContainer, marginVertical: 30}}>
                    
                    
                    <ProgDisplayer />
                

                <View style={{...fitStyles.group, flexDirection: "column"}}>
                    {/* opens up a modal or other page to enter data*/}
                    <CustomButton 
                    onPress={() => navigation.navigate('ProgCreate')} //make a js file, otherwise it will be too complex
                    //or just yeh make function in the above js section
                    text="+ Create Programe" 
                    width={360} 
                    height={45} 
                    color={"navy"}/>
                    
                    <View style={{height:20}}></View>
                    
                    {/* opens up a modal to see a flat list */}
                    <CustomButton 
                    onPress={() => navigation.navigate('ActivityHist')}
                    text="Activity History" 
                    width={360} 
                    height={45} 
                    color={"navy"}/>
                </View>
           
        </View>
        </ScrollView>
    )
}

