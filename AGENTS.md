# AGENTS.md - Elderly Wellness Agentic AI Solution

## Overview

This document outlines the agentic AI architecture for an elderly wellness platform that provides comprehensive healthcare management through intelligent automation, voice interaction, and emergency response capabilities.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Express.js API │    │  PostgreSQL DB  │
│  (Frontend)     │◄──►│   (Backend)     │◄──►│  (Sequelize)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └─────────────►│   n8n Workflows │◄─────────────┘
                        │  (Agentic Layer) │
                        └─────────────────┘
```

## Core Agents

### 1. Medication Management Agent

**Purpose**: Ensures timely medication adherence and prescription management

**Capabilities**:

- Monitor prescription schedules and generate alerts
- Track medication inventory and refill requirements
- Provide medication instructions and safety information
- Handle complex multi-medication prescriptions with varying schedules

**Data Models**:

```javascript
// Prescription entity with multiple medications
Prescription {
  id, patientId, doctorId, dateIssued, status,
  instructions, remarks, medications[]
}

// Individual medication with schedule
Medication {
  id, prescriptionId, name, dosage, form,
  schedule: { times[], frequency, duration },
  instructions, remarks, remainingCount
}
```

**Agent Behaviors**:

- **Proactive Alerting**: Generate notifications based on medication schedules
- **Adherence Tracking**: Monitor missed doses and patterns
- **Inventory Management**: Alert for refills and expired medications
- **Safety Monitoring**: Check for drug interactions and allergies

### 2. Appointment Management Agent

**Purpose**: Streamlines healthcare appointment scheduling and management

**Capabilities**:

- Intelligent appointment booking based on symptoms and medical history
- Doctor availability matching with patient preferences
- Location-based hospital recommendations
- Appointment reminders and rescheduling assistance

**Data Models**:

```javascript
// Hospital entity
Hospital {
  id, name, address, coordinates, contactInfo,
  facilities[], departments[], doctors[]
}

// Doctor with specializations and availability
Doctor {
  id, hospitalId, name, specializations[],
  workingHours, availableSlots[], consultationFee
}

// Appointment with context
Appointment {
  id, patientId, doctorId, hospitalId,
  dateTime, status, reason, symptoms,
  medicalContext, notes
}
```

**Agent Behaviors**:

- **Smart Scheduling**: Match symptoms to appropriate specialists
- **Availability Optimization**: Find best time slots considering all constraints
- **Location Intelligence**: Factor in travel distance and accessibility
- **Context Awareness**: Use medical history for appointment prioritization

### 3. Emergency Response Agent

**Purpose**: Provides immediate assistance and coordinates emergency services

**Capabilities**:

- Situation severity assessment through voice/chat analysis
- Emergency contact notification via SMS/calls
- First aid and CPR guidance
- Automatic emergency service coordination

**Integration Points**:

```javascript
// n8n Workflow Triggers
EmergencyWorkflows {
  assessSeverity(conversation, vitalSigns, context),
  provideFirstAid(situation, patientProfile),
  contactEmergencyServices(location, severity, medicalInfo),
  notifyEmergencyContacts(contacts, situation, location)
}
```

**Agent Behaviors**:

- **Severity Assessment**: Analyze conversation patterns and keywords
- **Immediate Response**: Provide step-by-step emergency instructions
- **Coordination**: Trigger multiple response workflows simultaneously
- **Continuous Monitoring**: Track situation evolution and adjust response

### 4. Voice Interaction Agent

**Purpose**: Enables natural voice-based interaction across all platform features

**Capabilities**:

- Voice command processing for all application functions
- Natural language understanding for health-related queries
- Accessibility-focused voice navigation
- Multi-modal interaction (voice + visual confirmations)

**Integration Architecture**:

```javascript
// Voice processing pipeline
VoiceAgent {
  speechToText(audioInput),
  intentRecognition(textInput, context),
  actionExecution(intent, parameters),
  textToSpeech(response, preferences)
}
```

**Agent Behaviors**:

- **Intent Recognition**: Understand medication, appointment, and emergency requests
- **Context Preservation**: Maintain conversation context across interactions
- **Accessibility**: Adapt to hearing and speech limitations
- **Confirmation Protocols**: Verify critical actions through voice confirmation

### 5. Medical History Analysis Agent

**Purpose**: Provides comprehensive health insights through data analysis

**Capabilities**:

- EHR integration and analysis
- Lab report interpretation
- Risk assessment and trend identification
- Personalized health recommendations

**Data Sources**:

```javascript
// Comprehensive medical profile
MedicalProfile {
  patientId, demographics, vitals[],
  conditions[], allergies[], familyHistory,
  labResults[], ehrRecords[], medications[],
  lifestyle, preferences
}

// Analysis results
HealthInsights {
  riskFactors[], trends[], recommendations[],
  alerts[], interactions[], contraindications[]
}
```

**Agent Behaviors**:

- **Pattern Recognition**: Identify health trends and anomalies
- **Risk Stratification**: Assess patient risk levels for various conditions
- **Personalization**: Tailor recommendations to individual profiles
- **Predictive Analytics**: Forecast potential health issues

## Agentic Workflows (n8n Integration)

### Emergency Assessment Workflow

```javascript
// Triggered by voice/chat input indicating distress
emergencyAssessment: {
  input: { conversation, symptoms, vitalSigns },
  steps: [
    "analyzeConversationSentiment",
    "extractSymptoms",
    "assessSeverity",
    "determineResponse",
    "executeActions"
  ],
  outputs: {
    severity: "low|medium|high|critical",
    actions: ["firstAid", "emergencyCall", "appointmentBooking"],
    instructions: "stepByStepGuidance"
  }
}
```

### Appointment Auto-Booking Workflow

```javascript
// Triggered by symptom description or scheduled check-up
appointmentBooking: {
  input: { symptoms, urgency, preferences, medicalHistory },
  steps: [
    "analyzeSymptoms",
    "matchSpecialization",
    "findNearbyHospitals",
    "checkAvailability",
    "bookAppointment",
    "sendConfirmation"
  ],
  outputs: {
    appointment: "scheduledAppointment",
    alternatives: "otherOptions[]",
    preparation: "preVisitInstructions"
  }
}
```

### Medication Adherence Monitoring

```javascript
// Continuous monitoring with periodic assessments
adherenceMonitoring: {
  input: { prescriptions, adherenceHistory, symptoms },
  steps: [
    "trackMissedDoses",
    "analyzePatterns",
    "assessImpact",
    "generateInterventions",
    "updateCareTeam"
  ],
  outputs: {
    adherenceScore: "percentage",
    interventions: "reminders|counseling|adjustments",
    careTeamAlert: "boolean"
  }
}
```

## Technical Implementation

### Backend Architecture (Express.js)

```javascript
// Agent controller structure
class AgentController {
    constructor(agent, workflows) {
        this.agent = agent;
        this.workflows = workflows;
    }

    async processRequest(req, res) {
        try {
            // Validate input and extract context
            const context = await this.extractContext(req);

            // Execute agent logic
            const result = await this.agent.process(context);

            // Trigger workflows if needed
            if (result.workflowTriggers) {
                await this.workflows.execute(result.workflowTriggers);
            }

            res.json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    }
}
```

### Frontend Integration (Next.js + shadcn)

```javascript
// Agent interaction hooks
export const useAgentInteraction = (agentType) => {
    const [state, setState] = useState("idle");
    const [response, setResponse] = useState(null);

    const invokeAgent = async (input, context) => {
        setState("processing");
        try {
            const result = await api.agents[agentType].process({
                input,
                context,
                sessionId: generateSessionId(),
            });
            setResponse(result);
            setState("completed");
        } catch (error) {
            setState("error");
            console.error(`Agent ${agentType} error:`, error);
        }
    };

    return { state, response, invokeAgent };
};
```

### Database Schema (Sequelize)

```javascript
// Agent interaction logging
const AgentInteraction = sequelize.define("AgentInteraction", {
    id: { type: DataTypes.UUID, primaryKey: true },
    patientId: { type: DataTypes.UUID, allowNull: false },
    agentType: { type: DataTypes.ENUM(...AGENT_TYPES) },
    input: { type: DataTypes.JSONB },
    output: { type: DataTypes.JSONB },
    context: { type: DataTypes.JSONB },
    workflowsTriggered: { type: DataTypes.ARRAY(DataTypes.STRING) },
    duration: { type: DataTypes.INTEGER },
    success: { type: DataTypes.BOOLEAN },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});
```

## Testing Strategy

### Backend Testing (Vitest + Supertest)

```javascript
// Agent behavior testing
describe("MedicationAgent", () => {
    let agent, mockWorkflows;

    beforeEach(() => {
        agent = new MedicationAgent();
        mockWorkflows = createMockWorkflows();
    });

    test("should generate alerts for missed medications", async () => {
        const context = {
            patientId: "test-patient",
            prescriptions: [mockPrescription],
            currentTime: "2024-01-15T10:00:00Z",
        };

        const result = await agent.processScheduleCheck(context);

        expect(result.alerts).toHaveLength(1);
        expect(result.alerts[0].type).toBe("missed_medication");
    });

    test("should trigger emergency workflow for critical interactions", async () => {
        const context = {
            newMedication: "warfarin",
            existingMedications: ["aspirin"],
            allergies: [],
        };

        const result = await agent.checkInteractions(context);

        expect(result.severity).toBe("high");
        expect(mockWorkflows.emergency.execute).toHaveBeenCalled();
    });
});
```

### Integration Testing

```javascript
// End-to-end agent workflow testing
describe("Emergency Response Integration", () => {
    test("should complete full emergency response workflow", async () => {
        const response = await request(app)
            .post("/api/agents/emergency/assess")
            .send({
                voiceInput: "I am having chest pain and difficulty breathing",
                patientId: "test-patient",
                location: { lat: 40.7128, lng: -74.006 },
            });

        expect(response.status).toBe(200);
        expect(response.body.severity).toBe("critical");
        expect(response.body.actionsTriggered).toContain("emergency_services");
        expect(response.body.instructions).toBeDefined();
    });
});
```

## Development Guidelines

### Code Documentation Standards

```javascript
/**
 * Analyzes patient conversation for emergency indicators
 *
 * @param {Object} conversation - Voice/text conversation data
 * @param {string} conversation.text - Transcribed text
 * @param {Array} conversation.sentiment - Sentiment analysis results
 * @param {Object} patientContext - Patient medical context
 * @param {Array} patientContext.conditions - Pre-existing conditions
 * @param {Array} patientContext.medications - Current medications
 * @returns {Promise<Object>} Assessment result with severity and recommendations
 *
 * @example
 * const assessment = await analyzeEmergencyIndicators(
 *   { text: "chest pain", sentiment: [{ label: "distress", score: 0.9 }] },
 *   { conditions: ["hypertension"], medications: ["lisinopril"] }
 * );
 */
async function analyzeEmergencyIndicators(conversation, patientContext) {
    // Implementation with detailed inline comments
}
```

### Component Architecture (shadcn)

```javascript
/**
 * AgentStatusCard - Displays current agent activity and status
 * Provides real-time updates on agent processes and allows user interaction
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AgentStatusCard({ agent, onInteract }) {
    // Component implementation with accessibility considerations
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {agent.name}
                    <Badge
                        variant={
                            agent.status === "active" ? "default" : "secondary"
                        }
                    >
                        {agent.status}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Status display and interaction controls */}
            </CardContent>
        </Card>
    );
}
```

## Monitoring and Analytics

### Agent Performance Metrics

- Response time and accuracy
- Workflow success rates
- User satisfaction scores
- Emergency response effectiveness
- Medical adherence improvements

### Logging and Observability

```javascript
// Structured logging for agent activities
const logger = createLogger({
    service: "elderly-wellness-agents",
    level: "info",
    format: {
        timestamp: true,
        patientId: true,
        agentType: true,
        action: true,
        duration: true,
        success: true,
    },
});
```

## Security and Privacy Considerations

### Data Protection

- HIPAA compliance for all medical data
- End-to-end encryption for voice communications
- Secure API authentication and authorization
- Audit trails for all agent interactions

### Emergency Protocols

- Fail-safe mechanisms for critical workflows
- Manual override capabilities
- Redundant communication channels
- Privacy-preserving emergency contacts

## Deployment and Scaling

### Infrastructure Requirements

- Real-time processing capabilities
- High availability for emergency services
- Scalable voice processing
- Secure data storage and backup

### Monitoring and Maintenance

- Continuous agent performance monitoring
- Regular workflow testing and updates
- Medical knowledge base maintenance
- User feedback integration
