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