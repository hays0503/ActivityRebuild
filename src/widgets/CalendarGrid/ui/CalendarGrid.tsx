import { TaskType } from "@/entities/Task/model/Task";
import {
  CalendarCursor,
  CalendarView,
  useCalendarNavigator,
} from "@/shared/hooks/useCalendarNavigator";
import {
  Box,
  Button,
  Flex,
  For,
  Heading,
  HStack,
  Link,
  Mark,
  Separator,
  Show,
  Spinner,
  Tabs,
  TabsValueChangeDetails,
  Text,
  VStack,
} from "@chakra-ui/react";
import Cell from "./Cell";
import { getDaysInMonth } from "@/shared/tools/monthUtils";
import { isWeekend } from "@/shared/tools/dayUtils";
import { getDaysInWeekUnderCursor } from "@/shared/tools/weekUtils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const NameProviderId: Record<string, string> = {
  CRM_BIZPROC_TASK: "Задачи в CRM (бизнес-процессы)",
  CRM_TODO: "Связаться с клиентом",
  VOXIMPLANT_CALL: "Звонки",
  CRM_TASKS_TASK: "Задачи в CRM (Сообщить о результате)",
  TASKS: "Задачи",
  CRM_EMAIL: "Письма",
  CRM_MEETING: "Встречи",
  CRM_WEBFORM: "Веб-формы",
  CALL_LIST: "Обзвон лидов",
  IMOPENLINES_SESSION: "Открытые линии",
  CRM_TASKS_TASK_COMMENT: "Комментарии",
  CRM_BIZPROC_WORKFLOW: "Бизнес-процессы",
};

const ProviderIdToUrl = (Task: TaskType) => {
  switch (Task.providerID) {
    case "IMOPENLINES_SESSION":
      return "#";
    case "CRM_WEBFORM":
      return "#";
    case "CALL_LIST":
      return "#";
    case "CRM_EMAIL":
      return "#";
    case "CRM_MEETING":
      if (Task.ownerType === "DEAL") {
        return `${Task.ownerUrl}`;
      }
      return `#`;
    case "TASKS":
      return `${Task.responsibleUrl}tasks/task/view/${Task.associatedEntityID}/`;
    case "CRM_TASKS_TASK":
      return `${Task.responsibleUrl}tasks/task/view/${Task.associatedEntityID}/`;
    case "CRM_TODO":
      if (Task.ownerType === "DEAL") {
        return `${Task.ownerUrl}`;
      }
      if (Task.ownerType === "LEAD") {
        return `${Task.ownerUrl}`;
      }
      return `/crm/contact/details/${Task.ownerID}`;
    case "CRM_BIZPROC_TASK":
      return `${Task.ownerUrl}`;
    case "VOXIMPLANT_CALL":
      if (Task.ownerType === "DEAL") {
        return `/crm/deal/details/${Task.ownerID}`;
      }
      if (Task.ownerType === "LEAD") {
        return `/crm/lead/details/${Task.ownerID}`;
      }
      break;
    default:
      return "#";
  }
};

const ProviderIdOnClick = (TaskItem: TaskType) => {
  return () => {
    window.BX.CrmActivityEditor.items[
      "MY_ACTIVITIES_crm_activity_grid_editor"
    ].viewActivity(TaskItem.ID, {});
  };
};

const DaysName = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

const FormatNumber = (num: number | string): string => {
  return Number(num) > 9 ? `${num}` : `0${num}`;
};

const DrawDayColor = (
  MinAndMax: [number, number],
  TaskCount: number
): string => {
  const [min, max] = MinAndMax;

  if (max <= min) return "rgb(0,255,0)";

  // нормализация 0..1
  const t = Math.min(Math.max((TaskCount - min) / (max - min), 0), 1);

  let r = 0,
    g = 0,
    b = 0;

  if (t <= 0.5) {
    // зелёный → жёлтый
    const k = t / 0.5; // 0..1
    r = Math.round(255 * k);
    g = 255;
  } else {
    // жёлтый → красный
    const k = (t - 0.5) / 0.5; // 0..1
    r = 255;
    g = Math.round(255 * (1 - k));
  }

  return `rgb(${r}, ${g}, ${b})`;
};

const RenderMonthName = ({ cursor }: { cursor: CalendarCursor }) => {
  const date = new Date(cursor.year, cursor.month, cursor.dayIndex + 1);

  const monthName = date.toLocaleDateString("ru", { month: "long" });

  const MonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  return (
    <HStack>
      <Separator flex="1" variant={"solid"} bg={"white"} />
      <Heading as="h2">{MonthName}</Heading>
      <Separator flex="1" variant={"solid"} />
    </HStack>
  );
};

const isToday = (daysString: string): boolean => {
  const Today = new Date();
  const [day, month, year] = daysString.split(".").map(Number);
  return (
    year === Today.getFullYear() &&
    month === Today.getMonth() + 1 &&
    day === Today.getDate()
  );
};

const RenderMonth = ({
  deals,
  cursor,
  MinAndMaxTasks,
  goToDay,
}: {
  deals: Map<string, Map<string, TaskType[]>>;
  cursor: CalendarCursor;
  MinAndMaxTasks: [number, number];
  goToDay: (dayIndex: number, year?: number, month?: number) => void;
}) => {
  const daysInMonth = getDaysInMonth(cursor.year, cursor.month);

  const firstDay = new Date(cursor.year, cursor.month, 1).getDay();

  const offset = (firstDay + 6) % 7;

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        gap={"1"}
        w={"100%"}
      >
        <For each={Array(offset).fill(null)}>
          {(_, index) => <Cell key={`empty-${index}`} bg={"transparent"} />}
        </For>
        <For each={Array(daysInMonth).fill(0)}>
          {(value, index) => {
            const day: number = index + 1;

            // 01-01-2022
            const key = `${FormatNumber(day)}.${FormatNumber(
              cursor.month + 1
            )}.${cursor.year}`;

            const listTodo = [
              ...(deals
                .get(key)
                ?.keys()
                .map(
                  (_key) =>
                    `${NameProviderId[_key] ?? _key}: ${
                      deals.get(key)?.get(_key)?.length
                    }`
                ) ?? []),
            ];
            const countTodo =
              deals
                .get(key)
                ?.entries()
                .reduce((acc, entry) => acc + entry[1].length, 0) ?? 0;

            return (
              <Cell
                key={`day-${day}`}
                bg={
                  isWeekend(cursor.year, cursor.month, day)
                    ? `linear-gradient(135deg, rgba(255,0,0,0.12), rgba(255,0,0,0.04))`
                    : "whiteAlpha.500"
                }
                boxShadow={"4px 4px 8px 0px rgba(34, 60, 80, 0.2)"}
                outline={isToday(key) ? "2px solid red" : "none"}
                overflowY="auto"
                marginTop={"1px"}
                onClick={() => {
                  console.log(day, cursor.year, cursor.month);
                  goToDay(day, cursor.year, cursor.month);
                }}
              >
                <HStack justifyContent={"space-between"}>
                  <Box
                    bg="white"
                    boxSize="30px"
                    rounded="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="14px"
                    fontWeight="bold"
                    color="black"
                    bgColor={DrawDayColor(MinAndMaxTasks, countTodo)}
                  >
                    {day}
                  </Box>
                  {/* <ColorSwatch rounded="full" size={'2xl'} value={DrawDayColor(MinAndMaxTasks,countTodo)}/> */}
                </HStack>
                <Show when={deals.has(key)}>
                  <Text>{`Количество дел: ${countTodo}`}</Text>
                  <Separator />
                  <VStack h="5" alignItems={"flex-start"}>
                    <For each={listTodo}>
                      {(item) => <Text key={item}>{item}</Text>}
                    </For>
                  </VStack>
                </Show>
              </Cell>
            );
          }}
        </For>
      </Box>
    </>
  );
};

const RenderDaysName = ({
  cursor,
  view,
}: {
  cursor: CalendarCursor;
  view: CalendarView;
}): React.JSX.Element => {
  const _DaysName =
    view === "month"
      ? DaysName
      : getDaysInWeekUnderCursor(cursor).map((d) => {
          //День недели в виде строки
          const monthName = d.toLocaleDateString("ru", { weekday: "long" });
          return monthName.charAt(0).toUpperCase() + monthName.slice(1);
        });

  return (
    <Box
      display={"grid"}
      gridTemplateColumns="repeat(7, 1fr)"
      gap={"1"}
      w={"100%"}
      h={"auto"}
    >
      <For each={_DaysName}>
        {(day, index) => (
          <Box
            outline={"solid"}
            key={`DayName-${day}-${index}`}
            bg={"green.400"}
          >
            <Heading textAlign={"center"}>{day}</Heading>
          </Box>
        )}
      </For>
    </Box>
  );
};

const RenderWeek = ({
  deals,
  cursor,
  MinAndMaxTasks,
}: {
  deals: Map<string, Map<string, TaskType[]>>;
  cursor: CalendarCursor;
  MinAndMaxTasks: [number, number];
}) => {
  const daysInWeek: Date[] = getDaysInWeekUnderCursor(cursor);

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        gridTemplateRows="repeat(1, 1fr)"
        gap={"1"}
        w={"100%"}
        h={"max-content"}
        marginTop={"1px"}
      >
        <For each={daysInWeek}>
          {(date, index) => {
            const key = `${FormatNumber(date.getDate())}.${FormatNumber(
              date.getMonth() + 1
            )}.${date.getFullYear()}`;

            const countTodo =
              deals
                .get(key)
                ?.entries()
                .reduce((acc, entry) => acc + entry[1].length, 0) ?? 0;

            return (
              <Cell
                key={`Day-${index}`}
                bg={"whiteAlpha.500"}
                outline={isToday(key) ? "2px solid red" : "none"}
                h={"auto"}
                margin={"2px"}
              >
                <Box position={"sticky"} top={0} bg={"blue.400"}>
                  <Box
                    bg="white"
                    rounded="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="14px"
                    fontWeight="bold"
                    color="black"
                    marginBottom={"1"}
                    bgColor={DrawDayColor(MinAndMaxTasks, countTodo)}
                  >
                    {key}
                  </Box>
                  <Box
                    bg="white"
                    rounded="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="14px"
                    fontWeight="bold"
                    color="black"
                    marginBottom={"1"}
                  >
                    <Show when={countTodo > 0}>
                      <Mark variant={"plain"}>
                        <Text>{`Запланировано дел: ${countTodo}`}</Text>
                      </Mark>
                    </Show>
                    <Show when={countTodo == 0}>
                      <Text color={"blackAlpha.400"}>{`Дел нет`}</Text>
                    </Show>
                  </Box>
                </Box>

                <For each={Array(24).fill(null)}>
                  {(_, hour) => {
                    const keyAndHour = `${FormatNumber(
                      date.getDate()
                    )}.${FormatNumber(
                      date.getMonth() + 1
                    )}.${date.getFullYear()} ${FormatNumber(hour)}`;

                    const TaskByDate: Map<string, TaskType[]> | undefined =
                      deals.get(key);
                    const TaskByHour: TaskType[] = TaskByDate
                      ? Array.from(TaskByDate.values())
                          .flat()
                          .filter(
                            (task) =>
                              // безопасно работаем с deadline
                              typeof task.deadline === "string" &&
                              task.deadline.startsWith(keyAndHour)
                          )
                      : [];

                    return (
                      <Flex
                        key={`hour-${hour}`}
                        justifyContent={"start"}
                        alignItems={"center"}
                        h={"100px"}
                        maxW={"250px"}
                        outline="1px solid white"
                      >
                        <Show when={index == 0}>
                          <Box
                            writingMode={"sideways-lr"}
                            textAlign={"center"}
                            h={"100%"}
                            bg={"green.500"}
                            outline={"1px solid white"}
                          >
                            <Text>{`${FormatNumber(hour)}:00`}</Text>
                          </Box>
                        </Show>
                        <VStack
                          alignItems={"flex-start"}
                          justifyContent={"flex-start"}
                          h="100%"
                          w="100%"
                          overflowY={"auto"}
                        >
                          <For each={TaskByHour}>
                            {(task) => (
                              <Link
                                variant="underline"
                                // href={ProviderIdToUrl(task)}
                                href="#"
                                onClick={ProviderIdOnClick(task)}
                                color={"white"}
                                _hover={{ color: "whiteAlpha.500" }}
                              >
                                <Text lineClamp="2">
                                  {`${task.ID} - ${task.subject}-${task.description}`}
                                </Text>
                              </Link>
                            )}
                          </For>
                        </VStack>
                      </Flex>
                    );
                  }}
                </For>
              </Cell>
            );
          }}
        </For>
      </Box>
    </>
  );
};

const RenderDay = ({
  deals,
  cursor,
  MinAndMaxTasks,
}: {
  deals: Map<string, Map<string, TaskType[]>>;
  cursor: CalendarCursor;
  MinAndMaxTasks: [number, number];
}) => {
  const CurrentDays: Date = new Date(
    cursor.year,
    cursor.month,
    cursor.dayIndex,
    0,
    0,
    0
  );

  const key = `${FormatNumber(CurrentDays.getDate())}.${FormatNumber(
    CurrentDays.getMonth() + 1
  )}.${CurrentDays.getFullYear()}`;

  const countTodo =
    deals
      .get(key)
      ?.entries()
      .reduce((acc, entry) => acc + entry[1].length, 0) ?? 0;

  console.log(deals);

  return (
    <>
      <Box
        display="grid"
        gap={"1"}
        w={"100%"}
        h={"70dvh"}
        marginTop={"1px"}
        overflowY={"auto"}
      >
        <Cell
          bg={"whiteAlpha.500"}
          outline={isToday(key) ? "2px solid red" : "none"}
          h={"auto"}
          margin={"2px"}
        >
          <Box position={"sticky"} top={0} bg={"blue.400"}>
            <Box
              bg="white"
              rounded="2xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="14px"
              fontWeight="bold"
              color="black"
              marginBottom={"1"}
              bgColor={DrawDayColor(MinAndMaxTasks, countTodo)}
            >
              {key}
            </Box>
            <Box
              bg="white"
              rounded="2xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="14px"
              fontWeight="bold"
              color="black"
              marginBottom={"1"}
            >
              <Show when={countTodo > 0}>
                <Mark variant={"plain"}>
                  <Text>{`Запланировано дел: ${countTodo}`}</Text>
                </Mark>
              </Show>
              <Show when={countTodo == 0}>
                <Text color={"blackAlpha.400"}>{`Дел нет`}</Text>
              </Show>
            </Box>
          </Box>

          <For each={Array(24).fill(null)}>
            {(_, hour) => {
              const keyAndHour = `${FormatNumber(
                CurrentDays.getDate()
              )}.${FormatNumber(
                CurrentDays.getMonth() + 1
              )}.${CurrentDays.getFullYear()} ${FormatNumber(hour)}`;

              const TaskByDate: Map<string, TaskType[]> | undefined =
                deals.get(key);
              const TaskByHour: TaskType[] = TaskByDate
                ? Array.from(TaskByDate.values())
                    .flat()
                    .filter(
                      (task) =>
                        // безопасно работаем с deadline
                        typeof task.deadline === "string" &&
                        task.deadline.startsWith(keyAndHour)
                    )
                : [];

              return (
                <Flex
                  key={`hour-${hour}`}
                  justifyContent={"start"}
                  alignItems={"center"}
                  h={TaskByHour.length > 0 ? "150px" : "50px"}
                  // maxW={"250px"}
                  outline="1px solid white"
                >
                  <Box
                    writingMode={"sideways-lr"}
                    textAlign={"center"}
                    h={"100%"}
                    bg={"green.500"}
                    outline={"1px solid white"}
                  >
                    <Text>{`${FormatNumber(hour)}:00`}</Text>
                  </Box>
                  <VStack
                    alignItems={"flex-start"}
                    justifyContent={"flex-start"}
                    h="100%"
                    w="100%"
                    overflowY={"auto"}
                  >
                    <For each={TaskByHour}>
                      {(task) => (
                        <Link
                          variant="underline"
                          href={ProviderIdToUrl(task)}
                          onClick={ProviderIdOnClick(task)}
                          color={"white"}
                          _hover={{ color: "whiteAlpha.500" }}
                        >
                          <Text lineClamp="2">
                            {`${task.ID} - ${task.subject}-${task.description}`}
                          </Text>
                        </Link>
                      )}
                    </For>
                  </VStack>
                </Flex>
              );
            }}
          </For>
        </Cell>
      </Box>
    </>
  );
};

const CalendarGrid = ({ deals }: { deals: Map<string, TaskType> }) => {
  const { view, cursor, next, prev, setView, goToDay } = useCalendarNavigator();
  const [direction, setDirection] = useState(0); // +1 = next, -1 = prev

  const handleNext = () => {
    setDirection(1);
    next();
  };

  const handlePrev = () => {
    setDirection(-1);
    prev();
  };

  const _TasksByDays = new Map<string, TaskType[]>();

  deals.forEach((task) => {
    const day = task.deadline.split(" ")[0];
    if (_TasksByDays.has(day)) {
      _TasksByDays.get(day)?.push(task);
    } else {
      _TasksByDays.set(day, [task]);
    }
  });

  const TaskByDaysAndProviderId = new Map<string, Map<string, TaskType[]>>();

  const MinAndMaxTasks: [number, number] = [0, 0];

  _TasksByDays.forEach((tasks, day) => {
    const newMap = new Map<string, TaskType[]>();
    tasks.forEach((task) => {
      if (newMap.has(task.providerID)) {
        newMap.get(task.providerID)?.push(task);
      } else {
        newMap.set(task.providerID, [task]);
      }
    });
    TaskByDaysAndProviderId.set(day, newMap);
  });

  _TasksByDays.forEach((tasks, day) => {
    const CountTask = tasks.length;
    MinAndMaxTasks[0] =
      CountTask < MinAndMaxTasks[0] ? CountTask : MinAndMaxTasks[0];
    MinAndMaxTasks[1] =
      CountTask > MinAndMaxTasks[1] ? CountTask : MinAndMaxTasks[1];
  });

  const sortedEntries = [..._TasksByDays.entries()].sort(([a], [b]) => {
    const [da, ma, ya] = a.split(".").map(Number);
    const [db, mb, yb] = b.split(".").map(Number);
    return (
      new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime()
    );
  });

  const TasksByDays = new Map(sortedEntries);
  const entries = Array.from(TasksByDays.entries());

  const range =
    entries.length === 0
      ? null
      : {
          from: entries[0][0],
          to: entries[entries.length - 1][0],
        };

  console.log("sortedMap", TasksByDays);

  return (
    <Box
      zIndex={1000}
      top={0}
      position={"fixed"}
      w={"100dvw"}
      h={"100dvh"}
      p={"1.5"}
      background={"AccentColor"}
      color={"AccentColorText"}
      justifyContent={"center"}
      alignItems={"center"}
      display={"flex"}
    >
      <Show
        when={deals.size !== 0}
        fallback={
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            w={"full"}
            h={"full"}
          >
            <VStack>
              <Heading>{"Загрузка...."}</Heading>
              <Spinner size="xl" />
            </VStack>
          </Flex>
        }
      >
        <VStack
          justifyContent={"center"}
          alignItems={"center"}
          display={"flex"}
          w={"100%"}
        >
          <Text>Масштаб: {view}</Text>
          <Text>Год: {cursor.year}</Text>
          <Text>Месяц: {cursor.month}</Text>
          <Text>Неделя: {cursor.weekIndex}</Text>
          <Text>День: {cursor.dayIndex}</Text>

          {range && (
            <Text>
              Найденный диапазон задач: {range.from} – {range.to}
            </Text>
          )}

          <HStack>
            <Button onClick={handlePrev}>{"<-"}</Button>
            <Button
              onClick={() =>
                goToDay(
                  new Date().getDate(),
                  new Date().getFullYear(),
                  new Date().getMonth()
                )
              }
            >
              Сегодня
            </Button>
            <Button onClick={handleNext}>{"->"}</Button>
          </HStack>

          <Tabs.Root
            w={"100%"}
            defaultValue="month"
            justifyContent={"center"}
            alignItems={"center"}
            display={"flex"}
            flexDir={"column"}
            variant="subtle"
            onValueChange={(details: TabsValueChangeDetails) => {
              console.log(details);
              setView(details.value as CalendarView);
            }}
            value={view}
          >
            <Tabs.List
              bg="bg.muted"
              rounded="l3"
              p="1"
              justifyContent={"center"}
            >
              <Tabs.Trigger value="month">Месяц</Tabs.Trigger>
              <Tabs.Trigger value="week">Неделя</Tabs.Trigger>
              <Tabs.Trigger value="day">День</Tabs.Trigger>
              <Tabs.Indicator rounded="l2" />
            </Tabs.List>

            <Tabs.Content value="month">
              <VStack bg={"AccentColor"}>
                <Heading as="h1" color={"white"}>
                  Масштаб месяц
                </Heading>
                <Separator />
                <RenderMonthName cursor={cursor} />
                <RenderDaysName cursor={cursor} view={view} />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${cursor.year}-${cursor.month}-${cursor.weekIndex}-${cursor.dayIndex}`} // ключ меняется только при смене даты
                    initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                    transition={{ type: "tween", duration: 0.3 }}
                    style={{
                      width: "100%",
                      height: "55dvh",
                      overflowY: "auto",
                    }}
                  >
                    <RenderMonth
                      deals={TaskByDaysAndProviderId}
                      cursor={cursor}
                      MinAndMaxTasks={MinAndMaxTasks}
                      goToDay={goToDay}
                    />
                  </motion.div>
                </AnimatePresence>
              </VStack>
            </Tabs.Content>
            <Tabs.Content value="week">
              <VStack bg={"AccentColor"}>
                <Heading as="h1">Масштаб неделя</Heading>
                <Separator />
                <RenderMonthName cursor={cursor} />
                <RenderDaysName cursor={cursor} view={view} />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${cursor.year}-${cursor.month}-${cursor.weekIndex}-${cursor.dayIndex}`}
                    initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                    transition={{ type: "tween", duration: 0.3 }}
                    style={{
                      width: "100%",
                      height: "60dvh",
                      overflowY: "auto",
                    }}
                  >
                    <RenderWeek
                      deals={TaskByDaysAndProviderId}
                      cursor={cursor}
                      MinAndMaxTasks={MinAndMaxTasks}
                    />
                  </motion.div>
                </AnimatePresence>
              </VStack>
            </Tabs.Content>
            <Tabs.Content value="day">
              <RenderDay
                deals={TaskByDaysAndProviderId}
                cursor={cursor}
                MinAndMaxTasks={MinAndMaxTasks}
              />
            </Tabs.Content>
          </Tabs.Root>
        </VStack>
      </Show>
    </Box>
  );
};

export default CalendarGrid;
