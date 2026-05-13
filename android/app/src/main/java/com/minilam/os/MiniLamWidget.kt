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
            verticalAlignment = Alignment.Vertical.CenterVertically,
            horizontalAlignment = Alignment.Horizontal.CenterHorizontally
        ) {
            // Header Status
            Row(
                modifier = GlanceModifier.fillMaxWidth().padding(bottom = 4.dp),
                verticalAlignment = Alignment.Vertical.CenterVertically
            ) {
                Box(modifier = GlanceModifier.size(4.dp).background(Color(0xFFFF3B30))) {}
                Spacer(modifier = GlanceModifier.width(4.dp))
                Text(
                    text = "MINILAM_CORE_v2.6",
                    style = TextStyle(
                        color = ColorProvider(Color.White.copy(alpha = 0.4f)),
                        fontSize = 7.sp,
                        fontWeight = FontWeight.Bold
                    )
                )
                Spacer(modifier = GlanceModifier.defaultWeight())
                Text(
                    text = "ID_42069",
                    style = TextStyle(
                        color = ColorProvider(Color.White.copy(alpha = 0.2f)),
                        fontSize = 7.sp
                    )
                )
            }

            // Music Info Area
            Row(
                modifier = GlanceModifier.fillMaxWidth().defaultWeight(),
                verticalAlignment = Alignment.Vertical.CenterVertically
            ) {
                Column(modifier = GlanceModifier.defaultWeight()) {
                    Text(
                        text = "NEO_KOBE_NIGHTS",
                        style = TextStyle(
                            color = ColorProvider(Color.White),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        ),
                        maxLines = 1
                    )
                    Text(
                        text = "VIRTUAL_SYNTH_WAVE",
                        style = TextStyle(
                            color = ColorProvider(Color.White.copy(alpha = 0.6f)),
                            fontSize = 9.sp
                        ),
                        maxLines = 1
                    )
                }
                
                // Pixelated waveform simulation
                Row(modifier = GlanceModifier.height(20.dp).padding(start = 8.dp)) {
                    val levels = listOf(0.3f, 0.8f, 0.5f, 0.9f, 0.4f, 0.7f)
                    levels.forEach { level ->
                        Box(
                            modifier = GlanceModifier
                                .width(2.dp)
                                .fillMaxHeight(level)
                                .background(Color.White.copy(alpha = 0.3f))
                                .padding(horizontal = 0.5.dp)
                        ) {}
                    }
                }
            }

            Spacer(modifier = GlanceModifier.height(8.dp))

            // Controls
            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                horizontalAlignment = Alignment.Horizontal.CenterHorizontally,
                verticalAlignment = Alignment.Vertical.CenterVertically
            ) {
                ControlIcon(context, "PREV")
                Spacer(modifier = GlanceModifier.width(12.dp))
                PlayPauseButton(context, true)
                Spacer(modifier = GlanceModifier.width(12.dp))
                ControlIcon(context, "NEXT")
            }
            
            Spacer(modifier = GlanceModifier.height(8.dp))
            
            // Progress Bar (Simplified for Glance)
            Box(
                modifier = GlanceModifier
                    .fillMaxWidth()
                    .height(2.dp)
                    .background(Color.White.copy(alpha = 0.1f))
            ) {
                Box(
                    modifier = GlanceModifier
                        .fillMaxWidth(0.65f) // Fixed progress for mock
                        .fillMaxHeight()
                        .background(Color(0xFFFF3B30))
                ) {}
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
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    val time = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())
                    
                    // Header line
                    Row(modifier = GlanceModifier.fillMaxWidth()) {
                        Text(
                            text = "TIME_SYNC",
                            style = TextStyle(color = ColorProvider(Color.White.copy(alpha = 0.4f)), fontSize = 8.sp, fontWeight = FontWeight.Bold)
                        )
                        Spacer(modifier = GlanceModifier.defaultWeight())
                        Text(
                            text = "GTM+7",
                            style = TextStyle(color = ColorProvider(Color.White.copy(alpha = 0.4f)), fontSize = 8.sp)
                        )
                    }

                    Spacer(modifier = GlanceModifier.defaultWeight())

                    // Large Time Display
                    Text(
                        text = time,
                        style = TextStyle(
                            color = ColorProvider(Color.White),
                            fontSize = 48.sp,
                            fontWeight = FontWeight.Bold,
                            textAlign = TextAlign.Center
                        )
                    )
                    
                    Spacer(modifier = GlanceModifier.defaultWeight())

                    // Dot matrix simulation at bottom
                    Row(
                        modifier = GlanceModifier.fillMaxWidth().height(20.dp),
                        verticalAlignment = Alignment.Vertical.CenterVertically,
                        horizontalAlignment = Alignment.Horizontal.CenterHorizontally
                    ) {
                        repeat(32) { i ->
                            Box(
                                modifier = GlanceModifier
                                    .size(2.dp)
                                    .padding(horizontal = 1.dp)
                                    .background(if (i % 8 == 0) Color(0xFFFF3B30) else Color.White.copy(alpha = 0.15f))
                            ) {}
                        }
                    }
                }
            }
        }
    }
}
