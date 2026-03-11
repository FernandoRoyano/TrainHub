"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Routine } from "@/services/routines.service";

Font.register({
  family: "Helvetica",
  fonts: [],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 32,
    backgroundColor: "#ffffff",
    color: "#111111",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2px solid #111111",
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: "#555555",
    marginBottom: 2,
  },
  meta: {
    fontSize: 9,
    color: "#888888",
    marginTop: 4,
  },
  daySection: {
    marginBottom: 18,
  },
  dayTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    paddingBottom: 3,
    borderBottom: "1px solid #dddddd",
  },
  dayNotes: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 6,
    fontStyle: "italic",
  },
  table: {
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #cccccc",
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #eeeeee",
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableRowSuperset: {
    flexDirection: "row",
    borderBottom: "1px solid #eeeeee",
    paddingVertical: 5,
    paddingHorizontal: 6,
    backgroundColor: "#f0f9ff",
  },
  colNum: { width: "5%", fontSize: 9 },
  colExercise: { width: "40%", fontSize: 9 },
  colSets: { width: "10%", fontSize: 9, textAlign: "center" },
  colReps: { width: "15%", fontSize: 9, textAlign: "center" },
  colRest: { width: "12%", fontSize: 9, textAlign: "center" },
  colNotes: { width: "18%", fontSize: 9, color: "#666666" },
  colHeaderText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#444444",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1px solid #eeeeee",
    paddingTop: 6,
  },
  footerText: {
    fontSize: 8,
    color: "#aaaaaa",
  },
  badge: {
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 8,
    color: "#555555",
  },
  badgesRow: {
    flexDirection: "row",
    marginTop: 6,
    flexWrap: "wrap",
  },
});

interface RoutinePdfDocumentProps {
  routine: Routine;
  clientName?: string;
}

export function RoutinePdfDocument({ routine, clientName }: RoutinePdfDocumentProps) {
  const today = new Date().toLocaleDateString("es-ES");

  return (
    <Document title={routine.name} author="TrainHub">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{routine.name}</Text>
          {clientName && (
            <Text style={styles.subtitle}>Cliente: {clientName}</Text>
          )}
          {routine.description && (
            <Text style={styles.subtitle}>{routine.description}</Text>
          )}
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{routine.duration_weeks} semanas</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{routine.days_per_week} días/semana</Text>
            </View>
            {routine.difficulty && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{routine.difficulty}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Days */}
        {(routine.days ?? []).map((day) => (
          <View key={day.id} style={styles.daySection} wrap={false}>
            <Text style={styles.dayTitle}>
              Día {day.day_number}{day.name ? ` — ${day.name}` : ""}
            </Text>
            {day.notes && (
              <Text style={styles.dayNotes}>{day.notes}</Text>
            )}

            {/* Table */}
            <View style={styles.table}>
              {/* Header row */}
              <View style={styles.tableHeader}>
                <Text style={[styles.colNum, styles.colHeaderText]}>#</Text>
                <Text style={[styles.colExercise, styles.colHeaderText]}>Ejercicio</Text>
                <Text style={[styles.colSets, styles.colHeaderText]}>Series</Text>
                <Text style={[styles.colReps, styles.colHeaderText]}>Reps</Text>
                <Text style={[styles.colRest, styles.colHeaderText]}>Descanso</Text>
                <Text style={[styles.colNotes, styles.colHeaderText]}>Notas</Text>
              </View>

              {/* Exercise rows */}
              {day.exercises.map((ex, i) => (
                <View
                  key={ex.id}
                  style={ex.superset_group !== null ? styles.tableRowSuperset : styles.tableRow}
                >
                  <Text style={styles.colNum}>{i + 1}</Text>
                  <Text style={styles.colExercise}>
                    {ex.exercise?.name ?? "Ejercicio"}
                    {ex.superset_group !== null ? " (SS)" : ""}
                  </Text>
                  <Text style={styles.colSets}>{ex.sets}</Text>
                  <Text style={styles.colReps}>{ex.reps}</Text>
                  <Text style={styles.colRest}>{ex.rest_seconds}s</Text>
                  <Text style={styles.colNotes}>{ex.notes ?? ""}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>TrainHub</Text>
          <Text style={styles.footerText}>{today}</Text>
        </View>
      </Page>
    </Document>
  );
}
