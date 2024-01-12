// Don't push unused imports to the repository, delete it.
import { Flex, Text, Heading, } from "@chakra-ui/react";
import { UserModel } from "../models/UserModel";
import studentList from "../../public/data/students.json";

// page imports
import NotFoundPage from "../pages/notFoundPage";

// component imports

/**
 * @author Bugra Karaaslan, 500830631, This is an example of how an page should be look.
 */

/**
 * If your entity have a lot of attributes create a model in the 'models' folder, otherwise you can write the
 * attributes in the Pageprops interface.
 */
interface PageProps {
  studentList?: UserModel[];
  secondName?: string;
}

// Make use of an function component.
export default function Example({ studentList, secondName }: PageProps) {
  // This is a nullcheck, if the data is empty the user will be returned to the notFound page or a similar page.
    if (!studentList && !secondName) {
      return <NotFoundPage />;
    }

  return (
    // If study is empty it will not render the Text component.
    <Flex alignItems='center' flexDir='column'>
      <Text as='h1'>The example page</Text>
      <Text as='h2'>The H2 text</Text>
      <Text>{secondName}</Text>
      {/* {!!studentList?.name && <Text>{studentList.name}</Text>} */}
      {studentList?.map((student) => {
        return (
          <Flex key={student._id} flexDir='column'>
            <Text as='p'>{student.firstName}</Text>
          </Flex>
        );
      })}
    </Flex>
  );
}

// A way to fetch data from API or Local Json
export const getStaticProps = async () => {
  return {
    props: {
      studentList,
    },
  };
};
