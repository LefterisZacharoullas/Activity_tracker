import { FlatList } from "react-native";
import ActivityItem from "./ActivityItem";

const ActivityList = ({ activitydata }) => {
    return (
        <FlatList
            data={activitydata}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ActivityItem item={item} />}
        />
    );
}

export default ActivityList;