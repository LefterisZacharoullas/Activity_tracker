import { FlatList } from "react-native";
import ActivityItem from "./ActivityItem";

const ActivityList = ({
    activitydata,
    onDeleteActivity,
    onConfigActivity,
    onSelectActivity,
    selectedActivity
}) => {
    return (
        <FlatList
            data={activitydata}
            keyExtractor={(item) => item.id.toString()}
            bounces={false}               // disable bounce on iOS
            overScrollMode="never"        // disable overscroll glow on Android
            contentContainerStyle={{ paddingBottom: 0 }}  // remove extra bottom padding
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <ActivityItem item={item}
                onDeleteActivity={onDeleteActivity}
                onConfigActivity={onConfigActivity}
                onSelectActivity={onSelectActivity}
                selectedActivity={selectedActivity}
            />}
        />
    );
}

export default ActivityList;