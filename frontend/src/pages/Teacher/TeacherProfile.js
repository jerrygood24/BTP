import { Box } from "@mui/material";
import LessonDetails from "./LessonDetails";
import TeacherDetails from "./TeacherDetails";

const TeacherProfile = () => {
    return (


        <Box

            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
        >

            <TeacherDetails />
            <LessonDetails />
        </Box>

    );
}

export default TeacherProfile;