package com.minilam.os

import android.content.Context
import android.os.Build
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.ImageProvider
import androidx.glance.action.ActionParameters
import androidx.glance.action.actionParametersOf
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.action.ActionCallback
import androidx.glance.appwidget.action.ToggleableStateKey
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.appwidget.provideContent
import androidx.glance.appwidget.state.updateAppWidgetState
import androidx.glance.background
import androidx.glance.layout.*
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextAlign
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import java.text.SimpleDateFormat
import java.util.*

class MiniLamWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            GlanceTheme {
                WidgetContent(context)
            }
        }
    }

    @Composable
    private fun WidgetContent(context: Context) {
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .background(Color.Black)
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Main Container with Glassmorphism Border simulation
            Box(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .padding(2.dp)
            ) {
                Column(
                    modifier = GlanceModifier.fillMaxSize(),
                    verticalAlignment = Alignment.Vertical.CenterVertically
                ) {
                    // Header Status
                    Row(
                        modifier = GlanceModifier.fillMaxWidth().padding(bottom = 8.dp),
                        horizontalAlignment = Alignment.Horizontal.Start
                    ) {
                        Text(
                            text = "SYSTEM_READY // 2035",
                            style = TextStyle(
                                color = ColorProvider(Color.White.copy(alpha = 0.4f)),
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold,
                                textAlign = TextAlign.Start
                            )
                        )
                    }

                    // Music Info Area
                    Row(
                        modifier = GlanceModifier.fillMaxWidth().defaultWeight(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = GlanceModifier.defaultWeight()) {
                            Text(
                                text = "STARDUST_PROFILES",
                                style = TextStyle(
                                    color = ColorProvider(Color.White),
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold
                                ),
                                maxLines = 1
                            )
                            Text(
                                text = "NEO_KOBE_STATION",
                                style = TextStyle(
                                    color = ColorProvider(Color.White.copy(alpha = 0.6f)),
                                    fontSize = 10.sp
                                ),
                                maxLines = 1
                            )
                        }
                        
                        // Small Dot Matrix Visualizer Simulation
                        Row(modifier = GlanceModifier.height(16.dp)) {
                            repeat(4) { i ->
                                Box(
                                    modifier = GlanceModifier
                                        .width(3.dp)
                                        .fillMaxHeight()
                                        .padding(horizontal = 0.5.dp)
                                        .background(if (i == 2) Color(0xFFFF3B30) else Color.White.copy(alpha = 0.3f))
                                ) {}
                            }
                        }
                    }

                    Spacer(modifier = GlanceModifier.height(8.dp))

                    // Controls
                    Row(
                        modifier = GlanceModifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        ControlIcon(context, "PREV")
                        Spacer(modifier = GlanceModifier.width(16.dp))
                        PlayPauseButton(context, true)
                        Spacer(modifier = GlanceModifier.width(16.dp))
                        ControlIcon(context, "NEXT")
                    }
                    
                    Spacer(modifier = GlanceModifier.height(8.dp))
                    
                    // Progress Bar
                    Row(
                        modifier = GlanceModifier
                            .fillMaxWidth()
                            .height(2.dp)
                            .background(Color.White.copy(alpha = 0.1f))
                    ) {
                        Box(
                            modifier = GlanceModifier
                                .defaultWeight()
                                .fillMaxHeight()
                                .background(Color(0xFFFF3B30))
                        ) {}
                        Spacer(modifier = GlanceModifier.defaultWeight())
                    }
                }
            }
        }
    }

    @Composable
    fun VinylWidgetContent(context: Context) {
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .background(Color.Black)
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
             // Mock Vinyl Disc using nested circles
             Box(
                 modifier = GlanceModifier
                    .size(100.dp)
                    .background(Color.DarkGray) // Outer rim
                    .padding(4.dp),
                 contentAlignment = Alignment.Center
             ) {
                 Box(
                     modifier = GlanceModifier
                        .fillMaxSize()
                        .background(Color.Black), // Surface
                     contentAlignment = Alignment.Center
                 ) {
                     // Label Center
                     Box(
                         modifier = GlanceModifier
                            .size(24.dp)
                            .background(Color(0xFFFF3B30)),
                         contentAlignment = Alignment.Center
                     ) {
                         Box(
                             modifier = GlanceModifier
                                .size(4.dp)
                                .background(Color.Black)
                         ) {}
                     }
                 }
             }
             
             Text(
                text = "ACTIVE_DECK // 33RPM",
                modifier = GlanceModifier.padding(top = 12.dp),
                style = TextStyle(
                    color = ColorProvider(Color.White),
                    fontSize = 8.sp,
                    fontWeight = FontWeight.Bold
                )
             )
        }
    }

    @Composable
    fun SystemStatusWidgetContent(context: Context) {
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .background(Color.Black)
                .padding(12.dp)
        ) {
            Text(
                text = "MINILAM_DIAGNOSTICS",
                style = TextStyle(color = ColorProvider(Color(0xFFFF3B30)), fontSize = 10.sp, fontWeight = FontWeight.Bold)
            )
            
            Spacer(modifier = GlanceModifier.height(8.dp))
            
            StatusRow("BATTERY", "87%", 0.87f)
            StatusRow("MEMORY", "2.4GB", 0.35f)
            StatusRow("STORAGE", "128GB", 0.62f)
            StatusRow("CPU_LOAD", "LOW", 0.12f)
            
            Spacer(modifier = GlanceModifier.defaultWeight())
            
            Text(
                text = "PERFORMANCE_MODE: ENABLED",
                style = TextStyle(color = ColorProvider(Color.White.copy(alpha = 0.4f)), fontSize = 8.sp)
            )
        }
    }

    @Composable
    private fun StatusRow(label: String, value: String, progress: Float) {
        Column(modifier = GlanceModifier.fillMaxWidth().padding(vertical = 4.dp)) {
            Row(modifier = GlanceModifier.fillMaxWidth()) {
                Text(text = label, style = TextStyle(color = ColorProvider(Color.White), fontSize = 8.sp))
                Spacer(modifier = GlanceModifier.defaultWeight())
                Text(text = value, style = TextStyle(color = ColorProvider(Color.White), fontSize = 8.sp))
            }
            Row(
                modifier = GlanceModifier.fillMaxWidth().height(1.dp).background(Color.White.copy(alpha = 0.1f))
            ) {
                Box(
                    modifier = GlanceModifier.defaultWeight().fillMaxHeight().background(Color.White.copy(alpha = 0.5f))
                ) {}
                if (progress < 1f) {
                    Spacer(modifier = GlanceModifier.defaultWeight())
                }
            }
        }
    }

    @Composable
    private fun ControlIcon(context: Context, type: String) {
        Box(
            modifier = GlanceModifier
                .size(32.dp)
                .clickable(actionRunCallback<ControlActionCallback>(
                    actionParametersOf(ActionParameters.Key<String>("command") to type)
                )),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = if (type == "PREV") "<<" else ">>",
                style = TextStyle(
                    color = ColorProvider(Color.White),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            )
        }
    }

    @Composable
    private fun PlayPauseButton(context: Context, isPlaying: Boolean) {
        Box(
            modifier = GlanceModifier
                .size(40.dp)
                .background(Color.White.copy(alpha = 0.05f))
                .clickable(actionRunCallback<ControlActionCallback>(
                    actionParametersOf(ActionParameters.Key<String>("command") to "TOGGLE")
                )),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = GlanceModifier
                    .size(12.dp)
                    .background(if (isPlaying) Color(0xFFFF3B30) else Color.White)
            ) {}
        }
    }
}

class ControlActionCallback : ActionCallback {
    override suspend fun onAction(
        context: Context,
        glanceId: GlanceId,
        parameters: ActionParameters
    ) {
        val command = parameters[ActionParameters.Key<String>("command")] ?: return
        // Send broadcast to MediaService or ForegroundService
    }
}


class ClockWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            GlanceTheme {
                Column(
                    modifier = GlanceModifier
                        .fillMaxSize()
                        .background(Color.Black)
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    val time = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())
                    
                    Text(
                        text = time,
                        style = TextStyle(
                            color = ColorProvider(Color.White),
                            fontSize = 42.sp,
                            fontWeight = FontWeight.Bold,
                            textAlign = TextAlign.Center
                        )
                    )
                    
                    Text(
                        text = "MINILAM_OS // BATTERY: 87%",
                        style = TextStyle(
                            color = ColorProvider(Color(0xFFFF3B30)),
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    
                    // Dot matrix pulse simulation
                    Row(modifier = GlanceModifier.padding(top = 8.dp)) {
                        repeat(12) {
                            Box(
                                modifier = GlanceModifier
                                    .size(2.dp)
                                    .padding(horizontal = 1.dp)
                                    .background(Color.White.copy(alpha = 0.2f))
                            ) {}
                        }
                    }
                }
            }
        }
    }
}
